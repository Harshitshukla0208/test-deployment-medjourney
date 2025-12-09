import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchUpstreamProfile } from '../../../lib/profile'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header is required' })
    }

    const response = await fetchUpstreamProfile(authHeader)
    const data = await response.json()

    return res.status(response.status).json(data)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return res.status(500).json({ message: 'Something went wrong' })
  }
}
