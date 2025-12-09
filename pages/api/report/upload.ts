import type { NextApiRequest, NextApiResponse } from 'next'
import { fetch, Agent } from 'undici'

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL

// Create a custom agent with extended timeouts for long-running uploads
// Headers timeout: 30 minutes (time to wait for server to start responding)
// Body timeout: 30 minutes (time to wait for body to be sent/received)
// Connect timeout: 30 seconds (time to establish connection)
const customAgent = new Agent({
  headersTimeout: 30 * 60 * 1000, // 30 minutes
  bodyTimeout: 30 * 60 * 1000,    // 30 minutes
  connectTimeout: 30 * 1000,       // 30 seconds
})

// Disable Next.js body parsing so we can stream the multipart form-data
export const config = {
  api: {
    bodyParser: false,
    // Increase the response timeout to 30 minutes for long uploads
    responseLimit: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ message: 'Method not allowed' })
  }

  if (!BASE) {
    return res.status(500).json({ message: 'API base URL is not configured' })
  }

  try {
    // Forward most headers, but drop hop-by-hop headers that shouldn't be proxied
    const headers = new Headers()
    for (const [key, value] of Object.entries(req.headers)) {
      if (!value) continue
      const lowerKey = key.toLowerCase()
      
      // Skip headers that shouldn't be forwarded
      if (['host', 'connection', 'content-length', 'transfer-encoding'].includes(lowerKey)) {
        continue
      }
      
      if (Array.isArray(value)) {
        headers.set(key, value.join(','))
      } else {
        headers.set(key, value)
      }
    }

    // Ensure we accept JSON back from the upstream
    if (!headers.has('accept')) {
      headers.set('accept', 'application/json')
    }

    // Create AbortController with extended timeout (30 minutes)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30 * 60 * 1000)

    try {
      // Use undici's fetch with custom dispatcher (agent) for extended timeouts
      const upstreamResponse = await fetch(`${BASE}/api/v1/report/report`, {
        method: 'POST',
        body: req as any, // Node's IncomingMessage is a readable stream and acceptable as fetch body
        headers,
        // CRITICAL: duplex is required when sending a stream as body
        duplex: 'half',
        signal: controller.signal,
        // Use custom dispatcher with extended timeouts
        dispatcher: customAgent,
      })

      clearTimeout(timeoutId)

      const contentType = upstreamResponse.headers.get('content-type') || 'application/json'
      const text = await upstreamResponse.text()

      res.status(upstreamResponse.status)
      res.setHeader('Content-Type', contentType)
      res.send(text)
    } catch (fetchError: any) {
      clearTimeout(timeoutId)
      
      if (fetchError.name === 'AbortError') {
        console.error('Upload timed out after 30 minutes')
        return res.status(504).json({ 
          message: 'Upload timed out. The file may be too large or processing is taking too long. Please try again.' 
        })
      }
      
      throw fetchError
    }
  } catch (error: any) {
    console.error('Error proxying report upload:', error)
    
    // Provide more specific error messages
    if (error.code === 'UND_ERR_HEADERS_TIMEOUT' || error.code === 'UND_ERR_BODY_TIMEOUT') {
      return res.status(504).json({ 
        message: 'Upload timed out while waiting for server response. The server may be processing a large file. Please try again.' 
      })
    }
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        message: 'Could not connect to upload service. Please try again later.' 
      })
    }
    
    return res.status(500).json({ 
      message: 'Something went wrong while uploading report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}