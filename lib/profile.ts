const BASE = process.env.NEXT_PUBLIC_API_BASE_URL

/**
 * Shape of the upstream get-profile response (partial).
 * We only care about `status` and `data.profile_id`.
 */
type UpstreamProfileResponse = {
  status?: boolean
  data?: {
    profile_id?: string | number
    // ...other fields we don't care about here
  } | null
  // ...other fields
}

/**
 * Low-level helper to call the upstream get-profile endpoint.
 * Accepts a full Authorization header value (e.g. "Bearer <token>").
 * This is safe to use from both Node (API routes) and edge/middleware.
 */
export async function fetchUpstreamProfile(
  authorizationHeader: string
): Promise<Response> {
  if (!BASE) {
    console.error('NEXT_PUBLIC_API_BASE_URL is not set')
    // Create a synthetic Response to keep the calling code simple
    return new Response(JSON.stringify({ message: 'Missing API base URL' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return fetch(`${BASE}/api/v1/profile/get-profile`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: authorizationHeader
    }
  })
}

/**
 * Shared helper to determine whether a profile exists
 * based on the upstream get-profile response body.
 */
export function doesProfileExistFromResponse(
  data: unknown
): boolean {
  const typed = data as UpstreamProfileResponse | null | undefined
  const profile = typed?.data
  return Boolean(typed?.status && profile && profile.profile_id)
}


