import type { NextApiRequest, NextApiResponse } from 'next'

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Extract Authorization header from the request
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header is required' })
    }

    const response = await fetch(`${BASE}/api/v1/profile/get-all-profile`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': authHeader
      }
    })

    const data = await response.json()
    return res.status(response.status).json(data)
  } catch (error) {
    console.error('Error fetching profiles:', error)
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

