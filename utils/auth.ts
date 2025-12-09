// src/utils/auth.ts
export const setCookie = (name: string, value: string, hours: number = 1) => {
    const expires = new Date(Date.now() + hours * 60 * 60 * 1000).toUTCString()
    if (typeof document !== 'undefined') {
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`
    }
}

export const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null

    const nameEQ = name + "="
    const ca = document.cookie.split(';')

    for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === ' ') c = c.substring(1, c.length)
        if (c.indexOf(nameEQ) === 0) {
            return decodeURIComponent(c.substring(nameEQ.length, c.length))
        }
    }
    return null
}

export const deleteCookie = (name: string) => {
    if (typeof document !== 'undefined') {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    }
}

export const isAuthenticated = (): boolean => {
    const token = getCookie('access_token')
    return !!token && token !== 'undefined' && token.trim() !== '' && !isJwtExpired(token)
}

export const getAccessToken = (): string | null => {
    return getCookie('access_token')
}

export const isJwtExpired = (token: string | null | undefined): boolean => {
    if (!token) return true
    try {
        const [, payloadBase64] = token.split('.')
        if (!payloadBase64) return true
        const payloadJson = typeof atob !== 'undefined' ? atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')) : Buffer.from(payloadBase64, 'base64').toString('utf-8')
        const payload = JSON.parse(payloadJson) as { exp?: number }
        if (!payload.exp) return true
        const nowSeconds = Math.floor(Date.now() / 1000)
        return payload.exp <= nowSeconds
    } catch {
        return true
    }
}

export const redirectToLoginExpired = () => {
    deleteCookie('access_token')
    deleteCookie('login_id')
    if (typeof window !== 'undefined') {
        window.location.href = '/auth?view=login&reason=expired'
    }
}

export const logout = () => {
    deleteCookie('access_token')
    deleteCookie('login_id')
    if (typeof window !== 'undefined') {
        window.location.href = '/auth?view=login'
    }
}

export const checkUserProfile = async (): Promise<{ exists: boolean; profiles?: unknown[] }> => {
    try {
        // Use auth-aware fetch; it will redirect on 401/missing/expired.
        // Call the Next.js API route which will proxy to the external API.
        const response = await (await import('@/lib/apiClient')).fetchWithAuth(
            '/api/profile/get-profile'
        )

        if (!response.ok) {
            return { exists: false }
        }

        const data = await response.json()

        const profile = data?.data
        const profileExists = Boolean(data?.status && profile && profile.profile_id)

        const profiles = profileExists ? [profile] : []

        return {
            exists: profileExists,
            profiles: profileExists ? profiles : []
        }
    } catch (error) {
        console.error('Error checking user profile:', error)
        return { exists: false }
    }
}

export const redirectBasedOnProfile = async (): Promise<void> => {
    if (!isAuthenticated()) {
        if (typeof window !== 'undefined') {
            window.location.href = '/auth?view=login'
        }
        return
    }

    const { exists } = await checkUserProfile()

    if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname
        if (exists) {
            if (currentPath !== '/auth/onboarding') {
                window.location.href = '/auth/onboarding'
            }
        } else {
            if (currentPath !== '/profile/create') {
                window.location.href = '/profile/create'
            }
        }
    }
}