'use client'

import Link from 'next/link'

const sections = [
  {
    title: '1. Acceptance of Terms',
    body:
      'By creating a MedJourney account or using our services, you agree to be bound by the latest version of these Terms and any referenced policies.',
  },
  {
    title: '2. Services Provided',
    body:
      'MedJourney provides AI-assisted insights on your health data. The platform does not replace professional medical advice and should be used as a companion experience only.',
  },
  {
    title: '3. User Responsibilities',
    body:
      'You are responsible for the accuracy of the information you provide and for keeping your credentials secure. Any misuse of the platform may result in suspension.',
  },
  {
    title: '4. Data Usage',
    body:
      'We anonymize and analyze user inputs to continuously improve our intelligence models. Review our Privacy Policy to understand how we store and process your information.',
  },
]

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 px-6 py-16">
      <div className="mx-auto w-full max-w-3xl space-y-10 rounded-2xl border border-slate-200 bg-white/90 p-10 shadow-xl">
        <div>
          <p className="text-xs uppercase tracking-wider text-primary">Legal</p>
          <h1 className="text-4xl font-semibold text-slate-900">Terms & Conditions</h1>
          <p className="mt-3 text-base text-slate-600">
            These terms describe the dummy contractual obligations between you and MedJourney. Replace this placeholder
            copy with your real legal content before going live.
          </p>
        </div>

        <div className="space-y-6">
          {sections.map((section) => (
            <section key={section.title} className="space-y-2">
              <h2 className="text-xl font-semibold text-slate-900">{section.title}</h2>
              <p className="text-sm text-slate-600">{section.body}</p>
            </section>
          ))}
        </div>

        <div className="rounded-xl bg-slate-50 p-6 text-sm text-slate-600">
          <p className="font-medium text-slate-900">Need clarification?</p>
          <p className="mt-1">
            Reach out to your legal counsel or{' '}
            <Link href="mailto:hello@medjourney.ai" className="text-primary underline">
              contact our team
            </Link>
            .
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-slate-500">
          <Link href="/" className="text-primary hover:underline">
            Return to home
          </Link>
          <span aria-hidden="true">•</span>
          <Link href="/privacy" className="text-primary hover:underline">
            View Privacy Policy
          </Link>
        </div>
      </div>
    </main>
  )
}

