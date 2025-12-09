'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ActivityIcon, Users, FileText, Stethoscope, CheckCircle2, ChevronRight } from 'lucide-react'
import Link from 'next/link'

type UserRole = 'personal' | 'lab-owner' | 'doctor'

const onboardingSteps: Record<
  UserRole,
  { title: string; subtitle: string; features: string[]; color: string; icon: React.ReactNode }
> = {
  personal: {
    title: 'Welcome to Your Personal Health Dashboard',
    subtitle: 'Manage your health reports and track your wellness journey',
    features: [
      'Upload and organize your health reports',
      'Get AI-powered insights and summaries',
      'Track critical vitals over time',
      'Prepare for visits with smart interviews',
    ],
    color: 'text-primary',
    icon: <Users className="h-12 w-12" />,
  },
  'lab-owner': {
    title: 'Lab Owner Dashboard Ready',
    subtitle: 'Manage your clients’ reports efficiently with AI insights',
    features: [
      'Bulk upload client reports',
      'Receive instant AI summaries',
      'Track client health timelines',
      'View actionable analytics',
    ],
    color: 'text-accent',
    icon: <FileText className="h-12 w-12" />,
  },
  doctor: {
    title: 'Doctor Console Active',
    subtitle: 'Send consultations and prepare for patient visits',
    features: [
      'Send pre-visit interviews to patients',
      'Review centralized health data',
      'Access AI-generated summaries',
      'Deliver better-prepared consultations',
    ],
    color: 'text-chart-3',
    icon: <Stethoscope className="h-12 w-12" />,
  },
}

export default function OnboardingPage() {
  const [roles, setRoles] = useState<UserRole[]>(['personal'])
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const storedRoles = localStorage.getItem('userRoles')
    if (storedRoles) {
      try {
        const parsed = JSON.parse(storedRoles) as UserRole[]
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRoles(parsed)
        }
      } catch {
        setRoles(['personal'])
      }
    }
  }, [])

  const currentRole = roles[currentStep] || 'personal'
  const step = onboardingSteps[currentRole]

  const goToDefaultDashboard = () => {
    const defaultDashboard =
      roles[0] === 'personal' ? '/personal' : roles[0] === 'lab-owner' ? '/lab' : '/doctor'
    window.location.href = defaultDashboard
  }

  const handleNext = () => {
    if (currentStep < roles.length - 1) {
      setCurrentStep((prev) => prev + 1)
      return
    }
    goToDefaultDashboard()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="inline-flex items-center gap-2 mb-12">
        <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
          <ActivityIcon className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="text-2xl font-bold text-foreground">MedJourney.ai</span>
      </Link>

      <Card className="w-full max-w-2xl border-0 shadow-lg overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-8 text-center">
            <div className={`h-16 w-16 mx-auto mb-4 ${step.color} flex items-center justify-center bg-white rounded-full`}>
              {step.icon}
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{step.title}</h1>
            <p className="text-muted-foreground">{step.subtitle}</p>
          </div>

          <div className="p-8 space-y-4">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">What you can do</p>
            <div className="space-y-3">
              {step.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {roles.length > 1 && (
            <div className="px-8 pb-6">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-3">You have multiple roles enabled:</p>
                <div className="flex flex-wrap gap-2">
                  {roles.map((role) => (
                    <div key={role} className="px-3 py-1 bg-primary/10 rounded-full text-xs font-medium text-primary capitalize">
                      {role === 'lab-owner' ? 'Lab Owner' : role}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="px-8 pb-8 flex gap-3">
            <Button variant="outline" size="lg" className="flex-1 bg-transparent" onClick={goToDefaultDashboard}>
              Skip Tour
            </Button>
            <Button size="lg" className="flex-1" onClick={handleNext}>
              {currentStep < roles.length - 1 ? 'Next Role' : 'Go to Dashboard'}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {roles.length > 1 && (
            <div className="px-8 pb-4 flex gap-2 justify-center">
              {roles.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all ${index === currentStep ? 'bg-primary w-8' : 'bg-muted w-2'}`}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground mt-8 text-center max-w-md">
        You can access all dashboards anytime from the main navigation.
      </p>
    </div>
  )
}

