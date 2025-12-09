import type { NextApiRequest, NextApiResponse } from 'next'

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
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
    const { profileId, firstName, lastName, gender, dateOfBirth, phoneNumber, relationship, roles } = req.body as {
      profileId?: string | number
      firstName?: string
      lastName?: string
      gender?: string
      dateOfBirth?: string
      phoneNumber?: string
      relationship?: string
      roles?: string[]
    }

    // profile_id is required
    if (!profileId) {
      return res.status(400).json({ message: 'profile_id is required' })
    }

    // Build query parameters
    const params = new URLSearchParams()
    params.append('profile_id', String(profileId))

    if (firstName !== undefined && firstName !== null) {
      params.append('first_name', firstName)
    }
    if (lastName !== undefined && lastName !== null) {
      params.append('last_name', lastName)
    }
    if (gender !== undefined && gender !== null) {
      params.append('gender', gender)
    }
    if (dateOfBirth !== undefined && dateOfBirth !== null) {
      params.append('date_of_birth', dateOfBirth)
    }
    if (phoneNumber !== undefined && phoneNumber !== null) {
      params.append('phone_no', phoneNumber)
    }
    if (relationship !== undefined && relationship !== null) {
      params.append('relationship', relationship)
    }

    // Request body should be a JSON array of roles
    // Default to ["Personal"] if not provided
    const rolesArray = Array.isArray(roles) && roles.length > 0 ? roles : ['Personal']

    const response = await fetch(`${BASE}/api/v1/profile/update-profile?${params.toString()}`, {
      method: 'PUT',
      headers: {
        accept: 'application/json',
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rolesArray),
    })

    const data = await response.json()
    return res.status(response.status).json(data)
  } catch (error) {
    console.error('Error updating profile:', error)
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

