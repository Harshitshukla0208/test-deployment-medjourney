'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { Eye, EyeOff, ActivityIcon, ArrowLeft } from 'lucide-react'
import GoogleIcon from '@/public/google.png'
import { redirectBasedOnProfile } from '@/utils/auth'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import PopupLoader from '@/components/PopupLoader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const COGNITO_URL = process.env.NEXT_PUBLIC_COGNITO_URL

const setCookie = (name: string, value: string, hours: number) => {
  const expires = new Date(Date.now() + hours * 60 * 60 * 1000).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`
}

class RedirectionManager {
  private static readonly KEY = 'leoquiRedirect'
  static set(path: string) {
    if (typeof window !== 'undefined') localStorage.setItem(this.KEY, path)
  }
  static pop(): string {
    if (typeof window === 'undefined') return '/profile/create'
    const v = localStorage.getItem(this.KEY)
    localStorage.removeItem(this.KEY)
    return v || '/profile/create'
  }
}

type View = 'login' | 'signup' | 'confirm' | 'resetRequest' | 'resetConfirm'

export function AuthForm() {
  const searchParams = useSearchParams()
  const initialView = (searchParams?.get('view') as View) || 'login'
  const [view, setView] = useState<View>(initialView)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [confirmationCode, setConfirmationCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [acceptedPolicies, setAcceptedPolicies] = useState(false)

  const handleSuccessfulAuth = useCallback(async (access_token: string, login_id?: string) => {
    setCookie('access_token', access_token, 1)
    if (login_id) setCookie('login_id', login_id, 1)
    toast.success('Logged in successfully')
    await redirectBasedOnProfile()
  }, [])

  const handleGoogleCallback = useCallback(
    async (code: string) => {
      setLoading(true)
      try {
        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        })
        const data = await res.json()
        if (
          !res.ok ||
          data.status === false ||
          !(data?.access_token || data?.data?.access_token) ||
          data?.access_token === 'undefined' ||
          data?.data?.access_token === 'undefined'
        ) {
          const errorMsg = data?.message || data?.detail || 'Google authentication failed'
          toast.error(errorMsg)
          return
        }
        const userIdentifier = data?.user?.sub || data?.user?.email || data?.user?.username
        await handleSuccessfulAuth(data?.access_token || data?.data?.access_token, userIdentifier)
      } catch (err: unknown) {
        const error = err as Error
        toast.error(error.message || 'Google authentication failed')
      } finally {
        setLoading(false)
      }
    },
    [handleSuccessfulAuth],
  )

  useEffect(() => {
    const url = new URL(window.location.href)
    const code = url.searchParams.get('code')
    const error = url.searchParams.get('error')
    if (error) {
      toast.error('Google authentication failed')
      window.history.replaceState({}, document.title, window.location.pathname)
      return
    }
    if (code) {
      handleGoogleCallback(code)
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [handleGoogleCallback])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      const apiStatus = data?.status
      if (!res.ok || apiStatus === false || apiStatus === 'exists' || apiStatus === 'error' || !data?.access_token || data.access_token === 'undefined') {
        const errorMsg = data?.message || data?.detail || 'Incorrect email or password'
        toast.error(errorMsg)
        return
      }
      await handleSuccessfulAuth(data.access_token, data.login_id)
    } catch (err: unknown) {
      const error = err as Error
      toast.error(error.message || 'An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (view !== 'signup') setAcceptedPolicies(false)
  }, [view])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!acceptedPolicies) {
      toast.error('Please accept the Terms & Privacy Policy to continue')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      const apiStatus = data?.status
      if (!res.ok) {
        throw new Error(data?.message || 'Signup failed')
      }
      if (apiStatus === 'exists' || apiStatus === false || apiStatus === 'error') {
        toast.error(data?.message || 'Signup failed')
        return
      }
      toast.success(data?.message || 'Verification code sent')
      setSignupPassword(password)
      setPassword('')
      setView('confirm')
    } catch (err: unknown) {
      const error = err as Error
      toast.error(error.message || 'An error occurred during signup')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/confirm-sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, confirmation_code: confirmationCode, password: signupPassword }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Confirmation failed')
      if (data?.access_token) {
        await handleSuccessfulAuth(data.access_token, data.login_id)
      } else {
        toast.success('Account confirmed, please login')
        setView('login')
      }
    } catch (err: unknown) {
      const error = err as Error
      toast.error(error.message || 'An error occurred during confirmation')
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/auth/resend-confirmation-code?username=${encodeURIComponent(email)}`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Failed to resend code')
      toast.success(data?.message || 'Code resent successfully')
    } catch (err: unknown) {
      const error = err as Error
      toast.error(error.message || 'An error occurred while resending code')
    } finally {
      setLoading(false)
    }
  }

  const handleResetInit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/password-reset/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Reset initiation failed')
      toast.success('Reset code sent to your email')
      setView('resetConfirm')
    } catch (err: unknown) {
      const error = err as Error
      toast.error(error.message || 'An error occurred during password reset')
    } finally {
      setLoading(false)
    }
  }

  const handleResetConfirm = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/password-reset/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, confirmation_code: confirmationCode, new_password: newPassword }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Reset confirmation failed')
      toast.success('Password reset successful. Please log in.')
      setView('login')
    } catch (err: unknown) {
      const error = err as Error
      toast.error(error.message || 'An error occurred during password reset')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = () => {
    RedirectionManager.set('/profile/create')
    if (COGNITO_URL) {
      window.location.href = COGNITO_URL
    } else {
      console.error('NEXT_PUBLIC_COGNITO_URL environment variable is not set')
    }
  }

  const viewMeta = useMemo<Record<View, { title: string; description: string }>>(
    () => ({
      login: {
        title: 'Sign In',
        description: 'Welcome back to your health dashboard',
      },
      signup: {
        title: 'Create Account',
        description: 'Get started with MedJourney in seconds',
      },
      confirm: {
        title: 'Verify Account',
        description: 'Enter the 6-digit code we sent to your email',
      },
      resetRequest: {
        title: 'Reset Password',
        description: 'Send a password reset code to your email',
      },
      resetConfirm: {
        title: 'Set New Password',
        description: 'Confirm your code and choose a new password',
      },
    }),
    [],
  )

  const { title, description } = viewMeta[view]

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex flex-col items-center justify-center px-4 py-7 pt-20 sm:pt-10">
      <Link
        href="/"
        className="absolute left-4 top-4 sm:left-6 sm:top-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>
      <PopupLoader open={loading} label="Signing you in…" />

      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
            <ActivityIcon className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">MedJourney.ai</span>
        </Link>
        <h1 className="text-3xl font-bold text-foreground mb-2">Your Health Journey, Intelligently Guided</h1>
        <p className="text-muted-foreground">Transform your health reports into actionable insights</p>
      </div>

      <Card className="w-full max-w-md border-0 shadow-xl bg-white/95 backdrop-blur">
        <CardHeader className="space-y-0">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {view === 'login' && (
            <>
              <Button
                className="w-full h-12 text-sm font-medium bg-white hover:bg-white/80 text-gray-800 hover:text-gray-900 border border-gray-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                variant="outline"
                onClick={handleGoogle}
                disabled={loading}
              >
                <div className="w-5 h-5 relative mr-3">
                  <Image src={GoogleIcon} alt="Google" fill className="object-contain" />
                </div>
                Continue with Google
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">Or continue with email</span>
                </div>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-800 font-medium text-sm">Email Address</Label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                    className="h-12 text-sm bg-white/80 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 placeholder:text-gray-500"
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-800 font-medium text-sm">Password</Label>
                  <div className="relative">
                    <Input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      className="h-12 pr-10 text-sm bg-white/80 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 placeholder:text-gray-500"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword((v) => !v)}
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                      aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                    >
                      {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
              <div className="text-center">
                <button className="text-primary hover:underline font-medium text-sm" onClick={() => setView('resetRequest')}>
                  Forgot Password?
                </button>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <button className="text-primary hover:underline font-medium" onClick={() => setView('signup')}>
                  Sign Up
                </button>
              </div>
            </>
          )}

          {view === 'signup' && (
            <>
              <Button
                className="w-full h-12 text-sm font-medium bg-white hover:bg-white/80 text-gray-800 hover:text-gray-900 border border-gray-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                variant="outline"
                onClick={handleGoogle}
                disabled={loading}
              >
                <div className="w-5 h-5 relative mr-3">
                  <Image src={GoogleIcon} alt="Google" fill className="object-contain" />
                </div>
                Continue with Google
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">Or sign up with email</span>
                </div>
              </div>
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-800 font-medium text-sm">Email Address</Label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                    className="h-12 text-sm bg-white/80 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 placeholder:text-gray-500"
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-800 font-medium text-sm">Password</Label>
                  <div className="relative">
                    <Input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showSignupPassword ? 'text' : 'password'}
                      required
                      className="h-12 pr-10 text-sm bg-white/80 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 placeholder:text-gray-500"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword((v) => !v)}
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                      aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
                    >
                      {showSignupPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="flex items-start space-x-3 rounded-lg border border-gray-200/70 bg-white/70 p-3 text-xs text-gray-600">
                  <Checkbox
                    id="legal-consent"
                    className="mt-[2px]"
                    checked={acceptedPolicies}
                    onCheckedChange={(checked) => setAcceptedPolicies(checked === true)}
                  />
                  <Label htmlFor="legal-consent" className="text-xs font-normal text-gray-600">
                    I agree to the{' '}
                    <Link href="/terms" className="text-primary underline-offset-4 hover:underline" target='_blank'>
                      Terms & Conditions
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-primary underline-offset-4 hover:underline" target='_blank'>
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  disabled={loading || !acceptedPolicies}
                >
                  {loading ? 'Signing up...' : 'Sign Up'}
                </Button>
              </form>
              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <button className="text-primary hover:underline font-medium" onClick={() => setView('login')}>
                  Login
                </button>
              </div>
            </>
          )}

          {view === 'confirm' && (
            <form onSubmit={handleConfirmSignUp} className="space-y-5">
              <div className="text-xs text-gray-700 bg-blue-50 p-4 rounded-lg border border-blue-200">
                We&apos;ve sent a verification code to <span className="font-semibold text-gray-900">{email}</span>.
              </div>
              <div className="space-y-2">
                <Label className="text-gray-800 font-medium text-sm">Verification Code</Label>
                <Input
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  maxLength={6}
                  required
                  className="h-12 text-sm bg-white/80 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 text-center tracking-widest font-mono"
                  placeholder="Enter 6-digit code"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </Button>
              <Button
                type="button"
                variant="link"
                onClick={handleResendCode}
                disabled={loading}
                className="w-full text-primary hover:underline font-medium text-sm"
              >
                Resend Code
              </Button>
            </form>
          )}

          {view === 'resetRequest' && (
            <form onSubmit={handleResetInit} className="space-y-5">
              <div className="text-xs text-gray-700 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                Enter your email address and we&apos;ll send you a code to reset your password.
              </div>
              <div className="space-y-2">
                <Label className="text-gray-800 font-medium text-sm">Email Address</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  className="h-12 text-sm bg-white/80 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 placeholder:text-gray-500"
                  placeholder="you@example.com"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Code'}
              </Button>
              <div className="text-center text-xs text-muted-foreground">
                Remember password?{' '}
                <button className="text-primary hover:underline font-medium" onClick={() => setView('login')}>
                  Login
                </button>
              </div>
            </form>
          )}

          {view === 'resetConfirm' && (
            <form onSubmit={handleResetConfirm} className="space-y-5">
              <div className="text-sm text-gray-700 bg-blue-50 p-4 rounded-lg border border-blue-200">
                Enter the code we sent to your email and your new password.
              </div>
              <div className="space-y-2">
                <Label className="text-gray-800 font-medium text-sm">Confirmation Code</Label>
                <Input
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  required
                  className="h-12 text-sm bg-white/80 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 placeholder:text-gray-500"
                  placeholder="Enter confirmation code"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-800 font-medium text-sm">New Password</Label>
                <div className="relative">
                  <Input
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    className="h-12 pr-10 text-sm bg-white/80 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 placeholder:text-gray-500"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-12 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground mt-8 text-center max-w-md space-x-1">
        <span>By signing up, you agree to our</span>
        <Link href="/terms" className="text-primary underline-offset-4 hover:underline">
          Terms & Conditions
        </Link>
        <span>and</span>
        <Link href="/privacy" className="text-primary underline-offset-4 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  )
}