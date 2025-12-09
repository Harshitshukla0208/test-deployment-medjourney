'use client'
import { AuthForm } from '@/components/auth/AuthForm'
import Image from 'next/image'
// import FrameBg from '@/assets/Frame100000.png'
import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'

function LoginContent() {
  // Hook must be called inside a Suspense boundary
  const searchParams = useSearchParams()
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const reason = searchParams?.get('reason')
      if (reason === 'expired') {
        toast.error('Session expired. Please log in again.')
        // Clean up URL but keep view parameter
        const view = searchParams?.get('view') || 'login'
        window.history.replaceState({}, document.title, `/auth?view=${view}`)
      }
    }
  }, [searchParams])
  return <AuthForm />
}

export default function LoginPage() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginContent />
      </Suspense>
    </main>
  )
}
