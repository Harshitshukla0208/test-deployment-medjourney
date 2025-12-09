"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, FileText, Users, Stethoscope, Upload, TrendingUp, Calendar, Menu, X } from "lucide-react"
import Link from "next/link"
import { isAuthenticated, deleteCookie } from "@/utils/auth"
import toast from "react-hot-toast"

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = () => {
      const authenticated = isAuthenticated()
      setIsLoggedIn(authenticated)
      
      // If token is expired or not present, ensure user is redirected if needed
      if (!authenticated) {
        // Clear any stale state
        setIsLoggedIn(false)
      }
    }

    checkAuth()
    // Check auth status periodically (every 30 seconds) to catch token expiration
    const interval = setInterval(checkAuth, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    deleteCookie('access_token')
    deleteCookie('login_id')
    setIsLoggedIn(false)
    // Use window.location for full page reload to clear all state
    if (typeof window !== 'undefined') {
      window.location.href = '/auth?view=login'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Activity className="h-7 w-7 text-primary" />
            <span className="text-xl font-semibold text-foreground">MedJourney.ai</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            {isLoggedIn ? (
              <>
                <Button size="sm" asChild>
                  <Link href="/auth/onboarding">Open App</Link>
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/auth?view=login">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth?view=signup">Get Started</Link>
                </Button>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <nav className="container mx-auto flex flex-col gap-4 px-4 py-4">
              <Link
                href="#features"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="#pricing"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
              {isLoggedIn ? (
                <>
                  <Button size="sm" asChild className="w-full">
                    <Link href="/auth/onboarding">Open App</Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleLogout} className="w-full bg-transparent">
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
                    <Link href="/auth?view=login">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild className="w-full">
                    <Link href="/auth?view=signup">Get Started</Link>
                  </Button>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6 text-balance">
            Transform Your Health Reports Into Actionable Insights
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty leading-relaxed">
            AI-powered platform that simplifies medical reports, tracks your health journey, and prepares you for doctor
            visits with intelligent analysis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-base">
              <Link href="/auth?view=signup">Start Your Journey</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-base bg-transparent">
              <Link href="#how-it-works">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16 md:py-24 bg-muted/30">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-balance">
            Comprehensive Health Management
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-pretty">
            Everything you need to understand and manage your health journey
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>For Personal Use</CardTitle>
                <CardDescription>Upload reports, get AI summaries, and track your health timeline</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Upload and store all health reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>AI-powered report interpretation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Visual health parameter timelines</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Pre-visit interview preparation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>For Lab Owners</CardTitle>
                <CardDescription>Manage client reports with AI-enhanced insights and analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Bulk upload client reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Generate AI summaries instantly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Interactive parameter graphs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Client health timelines</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-chart-3/10 flex items-center justify-center mb-4">
                  <Stethoscope className="h-6 w-6 text-chart-3" />
                </div>
                <CardTitle>For Doctors</CardTitle>
                <CardDescription>Send pre-visit consultations and review patient insights</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-chart-3 mt-0.5">•</span>
                    <span>Send pre-visit questionnaires</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-chart-3 mt-0.5">•</span>
                    <span>Review patient health timelines</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-chart-3 mt-0.5">•</span>
                    <span>Access AI-generated summaries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-chart-3 mt-0.5">•</span>
                    <span>Better-prepared consultations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-balance">How MedJourney Works</h2>
          <p className="text-center text-muted-foreground mb-12 text-pretty">
            Simple, secure, and intelligent health management in three steps
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Upload Reports</h3>
              <p className="text-muted-foreground text-pretty">
                Securely upload your health reports, lab results, or medical documents in any format
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. AI Analysis</h3>
              <p className="text-muted-foreground text-pretty">
                Our AI instantly analyzes your reports, simplifies medical jargon, and tracks trends
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-chart-3/10 flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-chart-3" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Track & Prepare</h3>
              <p className="text-muted-foreground text-pretty">
                View your health timeline, prepare for doctor visits, and make informed decisions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 bg-muted/30">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Ready to Take Control of Your Health Journey?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 text-pretty">
            Join thousands of people, labs, and doctors using MedJourney.ai
          </p>
          <Button size="lg" asChild className="text-base">
            <Link href="/auth?view=signup">Get Started Free</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-primary" />
              <span className="font-semibold text-foreground">MedJourney.ai</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 MedJourney.ai. Transforming healthcare with AI.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
