"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, ArrowLeft, Users, FileText, Stethoscope, Save, LogOut, Loader2 } from "lucide-react"
import Link from "next/link"
import { getAccessToken, isJwtExpired, redirectToLoginExpired } from "@/utils/auth"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { format, parse, isValid } from "date-fns"

type UserRole = "personal" | "lab-owner" | "doctor"

interface ProfileData {
  profile_id?: string | number
  first_name?: string
  last_name?: string
  email?: string
  date_of_birth?: string
  gender?: string
  phone_no?: string
  relationship?: string
  [key: string]: any // For any additional fields from API
}

const calculateAge = (dob?: string): number => {
  if (!dob) return 0

  // Support both "DD/MM/YYYY" and "YYYY-MM-DD" formats
  let birthDate: Date | null = null

  if (dob.includes("/")) {
    const parts = dob.split("/")
    if (parts.length === 3) {
      const [day, month, year] = parts.map((p) => Number.parseInt(p, 10))
      if (day && month && year) {
        birthDate = new Date(year, month - 1, day)
      }
    }
  } else if (dob.includes("-")) {
    const [yearStr, monthStr, dayStr] = dob.split("-")
    const year = Number.parseInt(yearStr, 10)
    const month = Number.parseInt(monthStr, 10)
    const day = Number.parseInt(dayStr, 10)
    if (day && month && year) {
      birthDate = new Date(year, month - 1, day)
    }
  }

  if (!birthDate || Number.isNaN(birthDate.getTime())) return 0

  const diffMs = Date.now() - birthDate.getTime()
  const ageDate = new Date(diffMs)
  return Math.abs(ageDate.getUTCFullYear() - 1970)
}

export default function SettingsPage() {
  const [roles, setRoles] = useState<UserRole[]>(["personal"])
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null)
  const [dateOfBirthString, setDateOfBirthString] = useState("")
  const [gender, setGender] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch profile data from API
  useEffect(() => {
    const fetchProfile = async () => {
      const token = getAccessToken()
      if (!token || isJwtExpired(token)) {
        redirectToLoginExpired()
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch("/api/profile/get-profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error("Failed to fetch profile", errorText)
          setError("Failed to load profile data. Please try again later.")
          setIsLoading(false)
          return
        }

        const data = await response.json()
        const profile = data?.data as ProfileData | null

        if (profile) {
          setProfileData(profile)
          setFirstName(profile.first_name || "")
          setLastName(profile.last_name || "")
          
          // Parse date of birth string to Date object
          const dobString = profile.date_of_birth || ""
          setDateOfBirthString(dobString)
          if (dobString) {
            // Try to parse DD/MM/YYYY format
            let parsedDate: Date | null = null
            if (dobString.includes("/")) {
              parsedDate = parse(dobString, "dd/MM/yyyy", new Date())
            } else if (dobString.includes("-")) {
              // Try YYYY-MM-DD format
              parsedDate = parse(dobString, "yyyy-MM-dd", new Date())
            }
            setDateOfBirth(isValid(parsedDate) ? parsedDate : null)
          } else {
            setDateOfBirth(null)
          }
          
          setGender(profile.gender || "")
          setPhoneNumber(profile.phone_no || "")
        } else {
          setError("No profile data found.")
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        setError("An error occurred while loading your profile.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  useEffect(() => {
    const storedRoles = localStorage.getItem("userRoles")
    if (storedRoles) {
      setRoles(JSON.parse(storedRoles))
    }
  }, [])

  // Track changes to form fields
  useEffect(() => {
    if (profileData) {
      // Convert dateOfBirth Date object to string for comparison
      const currentDobString = dateOfBirth ? format(dateOfBirth, "dd/MM/yyyy") : ""
      const originalDobString = profileData.date_of_birth || ""
      
      const hasFormChanges =
        firstName !== (profileData.first_name || "") ||
        lastName !== (profileData.last_name || "") ||
        currentDobString !== originalDobString ||
        gender !== (profileData.gender || "") ||
        phoneNumber !== (profileData.phone_no || "")

      setHasChanges(hasFormChanges)
    }
  }, [firstName, lastName, dateOfBirth, gender, phoneNumber, profileData])

  const handleRoleToggle = (role: UserRole) => {
    if (role === "personal") return

    const newRoles = roles.includes(role) ? roles.filter((r) => r !== role) : [...roles, role]

    if (!newRoles.includes("personal")) {
      newRoles.unshift("personal")
    }

    setRoles(newRoles)
    setHasChanges(true)
  }

  const getRoleFromUrl = (): string[] => {
    if (typeof window === 'undefined') return ['Personal']
    
    const pathname = window.location.pathname
    
    // Check current URL path
    if (pathname.includes('/doctor')) {
      return ['Doctor']
    } else if (pathname.includes('/lab')) {
      return ['Lab Owner']
    } else if (pathname.includes('/personal')) {
      return ['Personal']
    }
    
    // If not found in URL, check localStorage for user roles
    try {
      const storedRoles = localStorage.getItem('userRoles')
      if (storedRoles) {
        const parsedRoles = JSON.parse(storedRoles) as string[]
        if (Array.isArray(parsedRoles) && parsedRoles.length > 0) {
          // Map frontend role names to API role names
          const roleMap: Record<string, string> = {
            'personal': 'Personal',
            'lab-owner': 'Lab Owner',
            'doctor': 'Doctor'
          }
          
          // Get the first role and map it
          const firstRole = parsedRoles[0]
          const mappedRole = roleMap[firstRole] || 'Personal'
          return [mappedRole]
        }
      }
    } catch (error) {
      console.error('Error reading roles from localStorage:', error)
    }
    
    // Default to Personal if no match
    return ['Personal']
  }

  const handleSaveProfile = async () => {
    const token = getAccessToken()
    if (!token || isJwtExpired(token)) {
      redirectToLoginExpired()
      return
    }

    if (!profileData?.profile_id) {
      setError("Profile ID is missing. Please refresh the page.")
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      // Save roles to localStorage
      localStorage.setItem("userRoles", JSON.stringify(roles))

      // Convert Date object to MM/DD/YYYY format for API
      let apiDateOfBirth: string | undefined = undefined
      if (dateOfBirth && isValid(dateOfBirth)) {
        apiDateOfBirth = format(dateOfBirth, "MM/dd/yyyy")
      }

      // Determine role based on current URL path
      const roleArray = getRoleFromUrl()

      // Update profile via API
      const response = await fetch("/api/profile/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          profileId: profileData.profile_id,
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          dateOfBirth: apiDateOfBirth || undefined,
          gender: gender || undefined,
          phoneNumber: phoneNumber || undefined,
          roles: roleArray,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to update profile" }))
        throw new Error(errorData.message || "Failed to update profile")
      }

      const responseData = await response.json()
      
      // Refresh profile data after successful update
      const profileResponse = await fetch("/api/profile/get-profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (profileResponse.ok) {
        const data = await profileResponse.json()
        const updatedProfile = data?.data as ProfileData | null
        if (updatedProfile) {
          setProfileData(updatedProfile)
          // Update form fields with fresh data
          setFirstName(updatedProfile.first_name || "")
          setLastName(updatedProfile.last_name || "")
          
          // Parse date of birth string to Date object
          const dobString = updatedProfile.date_of_birth || ""
          setDateOfBirthString(dobString)
          if (dobString) {
            let parsedDate: Date | null = null
            if (dobString.includes("/")) {
              parsedDate = parse(dobString, "dd/MM/yyyy", new Date())
            } else if (dobString.includes("-")) {
              parsedDate = parse(dobString, "yyyy-MM-dd", new Date())
            }
            setDateOfBirth(isValid(parsedDate) ? parsedDate : null)
          } else {
            setDateOfBirth(null)
          }
          
          setGender(updatedProfile.gender || "")
          setPhoneNumber(updatedProfile.phone_no || "")
        }
      }

      setHasChanges(false)
      alert("Settings saved successfully!")
    } catch (error) {
      console.error("Error saving profile:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to save settings. Please try again."
      setError(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("userRoles")
    window.location.href = "/auth"
  }

  const handleDateChange = (newValue: Date | null) => {
    setDateOfBirth(newValue)
    if (newValue && isValid(newValue)) {
      setDateOfBirthString(format(newValue, "dd/MM/yyyy"))
    } else {
      setDateOfBirthString("")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/personal" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                <Activity className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-foreground">MedJourney.ai</span>
            </Link>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your profile and account preferences</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="roles">Roles & Access</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              {isLoading ? (
                <Card>
                  <CardContent className="p-12">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-muted-foreground">Loading profile data...</p>
                    </div>
                  </CardContent>
                </Card>
              ) : error ? (
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center text-destructive">
                      <p>{error}</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => window.location.reload()}
                      >
                        Retry
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your profile details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Enter first name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Enter last name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            value={dateOfBirth}
                            onChange={handleDateChange}
                            format="dd/MM/yyyy"
                            slotProps={{
                              textField: {
                                variant: "outlined",
                                fullWidth: true,
                                placeholder: "DD/MM/YYYY",
                                size: "small",
                                sx: {
                                  "& .MuiOutlinedInput-root": {
                                    height: "36px",
                                    fontSize: "0.875rem",
                                    borderRadius: "6px",
                                    "& fieldset": {
                                      borderColor: "hsl(var(--input))",
                                    },
                                    "&:hover fieldset": {
                                      borderColor: "hsl(var(--input))",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "hsl(var(--ring))",
                                      borderWidth: "1px",
                                    },
                                  },
                                  "& .MuiInputBase-input": {
                                    padding: "4px 12px",
                                    color: "hsl(var(--foreground))",
                                    fontSize: "0.875rem",
                                  },
                                  "& .MuiInputBase-input::placeholder": {
                                    color: "hsl(var(--muted-foreground))",
                                    opacity: 1,
                                  },
                                  "& .MuiSvgIcon-root": {
                                    fontSize: "1rem",
                                    color: "hsl(var(--muted-foreground))",
                                  },
                                },
                              },
                            }}
                          />
                        </LocalizationProvider>
                        {dateOfBirthString && (
                          <p className="text-xs text-muted-foreground">
                            Age: {calculateAge(dateOfBirthString)} years
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select value={gender} onValueChange={(value) => setGender(value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter phone number"
                      />
                    </div>

                    <Button
                      onClick={handleSaveProfile}
                      className="w-full gap-2"
                      disabled={!hasChanges || isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="roles" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Roles</CardTitle>
                  <CardDescription>
                    Select the roles you want to access. You will always have access to your health profile.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Personal Role */}
                  <div className="flex items-start space-x-3 p-3 rounded-lg border border-border">
                    <Checkbox checked={true} disabled className="mt-1" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Personal</p>
                      <p className="text-sm text-muted-foreground">Upload reports, track health, prepare for visits</p>
                    </div>
                  </div>

                  {/* Lab Owner Role */}
                  <label className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors">
                    <Checkbox
                      checked={roles.includes("lab-owner")}
                      onCheckedChange={() => handleRoleToggle("lab-owner")}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Lab Owner</p>
                      <p className="text-sm text-muted-foreground">
                        Manage client reports, bulk uploads, and analytics
                      </p>
                    </div>
                  </label>

                  {/* Doctor Role */}
                  <label className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors">
                    <Checkbox
                      checked={roles.includes("doctor")}
                      onCheckedChange={() => handleRoleToggle("doctor")}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Doctor</p>
                      <p className="text-sm text-muted-foreground">
                        Send consultations, manage patients, access health data
                      </p>
                    </div>
                  </label>

                  <Button
                    onClick={handleSaveProfile}
                    className="w-full gap-2"
                    disabled={!hasChanges || isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Roles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {roles.map((role) => (
                      <div
                        key={role}
                        className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium flex items-center gap-2"
                      >
                        {role === "personal" && <Users className="h-4 w-4" />}
                        {role === "lab-owner" && <FileText className="h-4 w-4" />}
                        {role === "doctor" && <Stethoscope className="h-4 w-4" />}
                        <span>{role === "personal" ? "Personal" : role === "lab-owner" ? "Lab Owner" : "Doctor"}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
