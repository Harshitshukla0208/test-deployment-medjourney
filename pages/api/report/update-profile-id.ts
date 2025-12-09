import type { NextApiRequest, NextApiResponse } from 'next'

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  if (!BASE) {
    return res.status(500).json({ message: 'API base URL is not configured' })
  }

  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header is required' })
    }

    const upstreamResponse = await fetch(`${BASE}/api/v1/report/update-profile-id`, {
      method: 'PUT',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify(req.body),
    })

    const data = await upstreamResponse.json()
    return res.status(upstreamResponse.status).json(data)
  } catch (error) {
    console.error('Error updating report profile id:', error)
    return res.status(500).json({ message: 'Something went wrong' })
  }
}


