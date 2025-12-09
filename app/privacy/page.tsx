'use client'

import Link from 'next/link'

const sections = [
  {
    title: '1. Information We Collect',
    body:
      'We collect the personal details you provide during registration, health documents you upload, and basic analytics required to secure and improve the platform.',
  },
  {
    title: '2. How We Use Your Data',
    body:
      'Uploaded health data is processed to deliver insights and personalize your experience. Aggregated, anonymized information may be used to enhance MedJourney services.',
  },
  {
    title: '3. Data Sharing & Security',
    body:
      'We never sell your personal information. Data is encrypted in transit and at rest, and only authorized personnel can access it for support or compliance purposes.',
  },
  {
    title: '4. Your Choices',
    body:
      'You can request data exports or deletion at any time by contacting our support team. Revoking consent may limit access to some MedJourney features.',
  },
]

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 px-6 py-16">
      <div className="mx-auto w-full max-w-3xl space-y-10 rounded-2xl border border-slate-200 bg-white/90 p-10 shadow-xl">
        <div>
          <p className="text-xs uppercase tracking-wider text-primary">Legal</p>
          <h1 className="text-4xl font-semibold text-slate-900">Privacy Policy</h1>
          <p className="mt-3 text-base text-slate-600">
            This placeholder policy outlines how we collect, use, and safeguard your information. Replace it with your
            organization’s vetted privacy statement before launching.
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
          <p className="font-medium text-slate-900">Questions about your data?</p>
          <p className="mt-1">
            Email us at{' '}
            <Link href="mailto:hello@medjourney.ai" className="text-primary underline">
              hello@medjourney.ai
            </Link>{' '}
            and we’ll be happy to help.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-slate-500">
          <Link href="/" className="text-primary hover:underline">
            Return to home
          </Link>
          <span aria-hidden="true">•</span>
          <Link href="/terms" className="text-primary hover:underline">
            View Terms & Conditions
          </Link>
        </div>
      </div>
    </main>
  )
}

