'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { isAuthenticated } from '@/utils/auth'
import { fetchWithAuth } from '@/lib/apiClient'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { format, isValid } from 'date-fns'
import { ActivityIcon, ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'

interface FormData {
  firstName: string
  lastName: string
  gender: string
  dateOfBirth: string
  phoneNumber: string
}

const genderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
]

const roleOptions = [
  { value: 'lab-owner', label: 'I am a Lab Owner', description: 'Manage client reports and analytics' },
  { value: 'doctor', label: 'I am a Doctor', description: 'Send consultations and manage patients' },
]

const apiRoleMap: Record<string, string> = {
  'lab-owner': 'Lab Owner',
  'doctor': 'Doctor',
}

export default function CreateProfile() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    phoneNumber: '',
  })

  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null)
  const [roles, setRoles] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false)
  const [isAllowed, setIsAllowed] = useState(false)

  // Client-side protection: redirect unauthenticated users to login
  useEffect(() => {
    const authed = isAuthenticated()
    if (!authed) {
      setRedirecting(true)
      router.replace('/login')
      return
    }
    setIsAllowed(true)
    setHasCheckedAuth(true)
  }, [router])

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleDateChange = (newValue: Date | null) => {
    setDateOfBirth(newValue)
    if (newValue && isValid(newValue)) {
      const formattedDate = format(newValue, 'MM/dd/yyyy')
      setFormData((prev) => ({
        ...prev,
        dateOfBirth: formattedDate,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        dateOfBirth: '',
      }))
    }
  }

  const toggleRole = (role: string) => {
    setRoles((prev) => (prev.includes(role) ? prev.filter((item) => item !== role) : [...prev, role]))
  }

  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast.error('Please fill in all required fields')
      return
    }

    setSubmitting(true)

    try {
      const normalizedRoles = Array.from(new Set(['Personal', ...roles.map((role) => apiRoleMap[role] ?? role)]))

      const response = await fetchWithAuth('/api/profile/create-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          phoneNumber: formData.phoneNumber,
          roles: normalizedRoles,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create profile')
      }

      toast.success('Profile created successfully!')

      const storedRoles = ['personal', ...(roles.length > 0 ? roles : [])]
      localStorage.setItem('userRoles', JSON.stringify(storedRoles))

      setTimeout(() => {
        router.push('/auth/onboarding')
      }, 1500)
    } catch (error: unknown) {
      const err = error as Error
      console.error('Error creating profile:', err)
      toast.error(err.message || 'Failed to create profile')
    } finally {
      setSubmitting(false)
    }
  }

  const isFormValid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.gender &&
      formData.dateOfBirth &&
      formData.phoneNumber
    )
  }

  if (redirecting || !hasCheckedAuth || !isAllowed) {
    return null
  }

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    handleSubmit()
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="relative min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex flex-col items-center justify-center px-4 py-7 pt-20 sm:pt-12">
        <Link
          href="/"
          className="absolute left-4 top-4 sm:left-6 sm:top-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <ActivityIcon className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">MedJourney.ai</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Complete Your Profile</h1>
          <p className="text-muted-foreground max-w-2xl">
            Help us personalize your experience. We&apos;ll tailor your MedJourney dashboard based on your profile details.
          </p>
        </div>

        <Card className="w-full max-w-3xl border-0 shadow-xl bg-white/95 backdrop-blur">
          <CardHeader className="space-y-0">
            <CardTitle className="text-2xl">Tell us about yourself</CardTitle>
            <CardDescription>We&apos;ll use this information to set up your personalized health workspace.</CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-4" onSubmit={onFormSubmit}>
              <section className="space-y-4">
                <h3 className="text-base font-semibold text-foreground">Basic Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="firstName">
                      First Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      disabled={submitting}
                      required
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lastName">
                      Last Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      disabled={submitting}
                      required
                      className="bg-background"
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4 pt-4 border-t border-border">
                <h3 className="text-base font-semibold text-foreground">Personal Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Date of Birth <span className="text-destructive">*</span></Label>
                    <div className="rounded-lg border border-border px-3 py-1 bg-background">
                      <DatePicker
                        value={dateOfBirth}
                        onChange={handleDateChange}
                        format="dd/MM/yyyy"
                        disabled={submitting}
                        slotProps={{
                          textField: {
                            variant: 'standard',
                            fullWidth: true,
                            placeholder: 'DD/MM/YYYY',
                            InputProps: {
                              disableUnderline: true,
                            },
                            sx: {
                              '& .MuiInputBase-root': {
                                border: 'none',
                                padding: 0,
                                height: '42px',
                                fontSize: '0.9rem',
                              },
                              '& .MuiInputBase-input': {
                                padding: 0,
                                color: '#0f172a',
                                fontSize: '0.9rem',
                              },
                              '& .MuiInputBase-input::placeholder': {
                                color: '#94a3b8',
                                opacity: 1,
                                fontSize: '0.85rem',
                              },
                              '& .MuiSvgIcon-root': {
                                fontSize: '1rem',
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label>
                      Gender <span className="text-destructive">*</span>
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      {genderOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleInputChange('gender', option.value)}
                          disabled={submitting}
                          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                            formData.gender === option.value
                              ? 'border-primary bg-primary/10 text-primary shadow-sm'
                              : 'border-border text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4 pt-4 border-t border-border">
                <h3 className="text-base font-semibold text-foreground">Contact Details</h3>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">
                    Phone Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    disabled={submitting}
                    required
                    className="bg-background"
                  />
                </div>
              </section>

              <section className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">My Role (Optional)</h3>
                    <p className="text-sm text-muted-foreground">
                      You will always have access to your personal health dashboard. Add more roles if applicable.
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {roleOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`w-full rounded-xl border px-4 py-3 flex gap-3 items-start transition-colors cursor-pointer ${
                        roles.includes(option.value)
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                      } ${submitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      <Checkbox
                        checked={roles.includes(option.value)}
                        onCheckedChange={() => toggleRole(option.value)}
                        disabled={submitting}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-medium text-foreground">{option.label}</p>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </section>

              <div className="pt-2">
                <Button type="submit" size="lg" className="w-full" disabled={!isFormValid() || submitting}>
                  {submitting ? 'Creating Profile...' : 'Proceed'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground mt-8 text-center max-w-md">
          You can revisit this information anytime from your account settings.
        </p>
      </div>
    </LocalizationProvider>
  )
}
