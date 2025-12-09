import type { NextApiRequest, NextApiResponse } from 'next'

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
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

    const { profile_id, page_number = '1', page_size = '10' } = req.query

    const searchParams = new URLSearchParams()
    if (profile_id && typeof profile_id === 'string') {
      searchParams.set('profile_id', profile_id)
    }
    if (page_number && typeof page_number === 'string') {
      searchParams.set('page_number', page_number)
    }
    if (page_size && typeof page_size === 'string') {
      searchParams.set('page_size', page_size)
    }

    const url = `${BASE}/api/v1/report/get-all-reports?${searchParams.toString()}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: authHeader,
      },
    })

    const data = await response.json()
    return res.status(response.status).json(data)
  } catch (error) {
    console.error('Error fetching reports:', error)
    return res.status(500).json({ message: 'Something went wrong' })
  }
}


