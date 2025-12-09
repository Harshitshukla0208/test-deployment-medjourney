import type { NextApiRequest, NextApiResponse } from 'next'

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  if (!BASE) {
    return res.status(500).json({ message: 'API base URL is not configured' })
  }

  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header is required' })
  }

  try {
    const { firstName, lastName, gender, dateOfBirth, phoneNumber, relationship, roles } = req.body as {
      firstName?: string
      lastName?: string
      gender?: string
      dateOfBirth?: string
      phoneNumber?: string
      relationship?: string
      roles?: string[]
    }

    if (!firstName || !lastName || !gender || !dateOfBirth) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const params = new URLSearchParams({
      first_name: firstName,
      last_name: lastName,
      date_of_birth: dateOfBirth,
      gender,
    })

    if (phoneNumber) {
      params.append('phone_no', phoneNumber)
    }

    if (relationship) {
      params.append('relationship', relationship)
    }

    const response = await fetch(`${BASE}/api/v1/profile/create-profile?${params.toString()}`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Array.isArray(roles) && roles.length > 0 ? roles : ['Personal']),
    })

    const data = await response.json()
    return res.status(response.status).json(data)
  } catch (error) {
    console.error('Error creating profile:', error)
    return res.status(500).json({ message: 'Something went wrong' })
  }
}


