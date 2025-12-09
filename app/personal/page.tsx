"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Activity,
  Settings,
  LogOut,
  ChevronDown,
  FileText,
  Upload,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Loader2,
  Users,
  Plus,
} from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { useUserRoles } from "@/components/auth/role-manager"
import { ProfileSelector, type FamilyProfile } from "@/components/personal/profile-selector"
import { ReportsList, type HealthReport } from "@/components/personal/reports-list"
import { HealthTimeline } from "@/components/personal/health-timeline"
import { getAccessToken, isJwtExpired, redirectToLoginExpired } from "@/utils/auth"

type UserRole = "personal" | "lab-owner" | "doctor"

const mockProfiles: FamilyProfile[] = [
  { id: "self", name: "John Doe", relationship: "Self", age: 35, gender: "male", color: "bg-blue-500" },
]

const PROFILE_COLORS = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500", "bg-orange-500", "bg-teal-500"]

interface NewProfilePayload {
  firstName: string
  lastName: string
  relationship: string
  gender: string
  dateOfBirth: string // expected from input type="date" (YYYY-MM-DD)
  phoneNumber?: string
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

const mockReports: HealthReport[] = [
  {
    id: "1",
    name: "Complete Blood Count",
    date: "January 15, 2025",
    lab: "City Diagnostics",
    profileId: "self",
    summary: [
      {
        type: "good",
        title: "Blood Sugar Normal",
        description: "Fasting glucose at 92 mg/dL is within healthy range.",
      },
      {
        type: "attention",
        title: "LDL Cholesterol Elevated",
        description: "LDL at 142 mg/dL is above optimal 100 mg/dL.",
      },
      {
        type: "info",
        title: "Vitamin D Sufficient",
        description: "Level at 28 ng/mL, consider increasing to 40-50 ng/mL.",
      },
    ],
    parameters: [
      { name: "Fasting Glucose", value: "92", unit: "mg/dL", status: "normal", normalRange: "70-100 mg/dL" },
      { name: "LDL Cholesterol", value: "142", unit: "mg/dL", status: "attention", normalRange: "<100 mg/dL" },
      { name: "HDL Cholesterol", value: "55", unit: "mg/dL", status: "normal", normalRange: ">40 mg/dL" },
      { name: "Hemoglobin", value: "14.4", unit: "g/dL", status: "normal", normalRange: "13.5-17.5 g/dL" },
      { name: "Vitamin D", value: "28", unit: "ng/mL", status: "normal", normalRange: "20-50 ng/mL" },
    ],
    tips: [
      {
        icon: "diet",
        title: "Reduce Saturated Fats",
        description: "To lower LDL, limit red meat and full-fat dairy. Choose olive oil over butter.",
      },
      {
        icon: "supplement",
        title: "Consider Vitamin D",
        description: "Your Vitamin D is adequate but on the lower end. 15 mins of sunlight daily can help.",
      },
    ],
  },
  {
    id: "2",
    name: "Lipid Profile",
    date: "November 10, 2024",
    lab: "HealthFirst Labs",
    profileId: "self",
    summary: [
      {
        type: "attention",
        title: "Total Cholesterol High",
        description: "At 225 mg/dL, slightly above recommended 200 mg/dL.",
      },
      { type: "good", title: "Triglycerides Normal", description: "At 120 mg/dL, well within normal range." },
    ],
    parameters: [
      { name: "Total Cholesterol", value: "225", unit: "mg/dL", status: "attention", normalRange: "<200 mg/dL" },
      { name: "Triglycerides", value: "120", unit: "mg/dL", status: "normal", normalRange: "<150 mg/dL" },
      { name: "LDL Cholesterol", value: "148", unit: "mg/dL", status: "attention", normalRange: "<100 mg/dL" },
      { name: "HDL Cholesterol", value: "52", unit: "mg/dL", status: "normal", normalRange: ">40 mg/dL" },
    ],
    tips: [
      {
        icon: "exercise",
        title: "Increase Cardio Activity",
        description: "30 mins of brisk walking 5x/week can help raise HDL and lower LDL cholesterol.",
      },
      {
        icon: "diet",
        title: "Add More Fiber",
        description: "Oats, beans, and vegetables can help reduce cholesterol absorption. Aim for 25g fiber daily.",
      },
      {
        icon: "lifestyle",
        title: "Limit Alcohol",
        description: "If you drink, limiting to 1 drink/day can help improve your lipid profile.",
      },
    ],
  },
]

export default function PersonalDashboard() {
  const [profiles, setProfiles] = useState<FamilyProfile[]>([])
  const [selectedProfile, setSelectedProfile] = useState<FamilyProfile | null>(null)
  const [reports, setReports] = useState<HealthReport[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStep, setUploadStep] = useState<"idle" | "select-profile" | "uploading" | "complete">("idle")
  const [pendingFiles, setPendingFiles] = useState<FileList | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isLoadingReports, setIsLoadingReports] = useState(false)
  const [processingReportId, setProcessingReportId] = useState<string | null>(null)
  const { roles, isLoading } = useUserRoles()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const fileInputInitialRef = useRef<HTMLInputElement>(null)

  // Load profiles for the current user when the page mounts
  useEffect(() => {
    const fetchProfiles = async () => {
      const token = getAccessToken()
      if (!token || isJwtExpired(token)) {
        redirectToLoginExpired()
        return
      }

      try {
        const params = new URLSearchParams({
          page_number: "1",
          page_size: "10",
        })

        const response = await fetch(`/api/profile/get-all-profile?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          console.error("Failed to fetch profiles", await response.text())
          // Fallback to a default self profile so UI still works
          setProfiles(mockProfiles)
          setSelectedProfile(mockProfiles[0] || null)
          return
        }

        const data = await response.json()
        const apiProfiles = Array.isArray(data?.data) ? data.data : []

        const mappedProfiles: FamilyProfile[] = apiProfiles.map((p: any, index: number) => ({
          id: p.profile_id,
          name: `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() || "Unknown",
          relationship: p.relationship || "Self",
          age: calculateAge(p.date_of_birth),
          gender: (p.gender || "").toLowerCase(),
          color: PROFILE_COLORS[index % PROFILE_COLORS.length],
        }))

        setProfiles(mappedProfiles)

        // Prefer the "self" relationship as the default selected profile
        const selfProfile =
          mappedProfiles.find(
            (p) => p.relationship.toLowerCase() === "self" || p.relationship.toLowerCase() === "personal",
          ) || mappedProfiles[0] || null

        setSelectedProfile(selfProfile)
      } catch (error) {
        console.error("Error fetching profiles:", error)
        setProfiles(mockProfiles)
        setSelectedProfile(mockProfiles[0] || null)
      }
    }

    fetchProfiles()
  }, [])

  // Load reports from API when a profile is selected
  const fetchReports = async (silent = false, excludeProcessingId: string | null = null) => {
    if (!selectedProfile) return

    const token = getAccessToken()
    if (!token || isJwtExpired(token)) {
      redirectToLoginExpired()
      return
    }

    try {
      if (!silent) {
        setIsLoadingReports(true)
      }
      const params = new URLSearchParams({
        profile_id: selectedProfile.id,
        page_number: "1",
        page_size: "10",
      })

      const response = await fetch(`/api/report/get-all-reports?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        console.error("Failed to fetch reports", await response.text())
        if (!silent) {
          setReports([])
        }
        return
      }

      const data = await response.json()
      const apiReports = Array.isArray(data?.reports) ? data.reports : []

      const mappedReports: HealthReport[] = apiReports.map((r: any) => ({
        id: r.id,
        name: r.name || "Health Report",
        date:
          r.report_date ||
          new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        lab: r.patient_id || "Uploaded Report",
        profileId: selectedProfile.id,
        summary: [
          {
            type: "info" as const,
            title: "AI Health Insight",
            description: r.healthinsight || "Detailed health insight is available in the full report.",
          },
        ],
        parameters: [],
        tips: [
          {
            icon: "lifestyle",
            title: "Discuss with your doctor",
            description:
              "Use this AI-generated insight as a starting point and always confirm next steps with your doctor.",
          },
        ],
      }))

      // When refreshing silently, preserve processing reports only if not excluding a specific one
      if (silent && !excludeProcessingId) {
        setReports((prev) => {
          const processingReports = prev.filter((r) => r.isProcessing)
          return [...mappedReports, ...processingReports]
        })
      } else if (excludeProcessingId) {
        // When excluding a processing report, replace all reports with API reports
        // This ensures the processing report is removed and replaced with real data
        setReports(mappedReports)
      } else {
        setReports(mappedReports)
      }
    } catch (error) {
      console.error("Error fetching reports:", error)
      if (!silent) {
        setReports([])
      }
    } finally {
      if (!silent) {
        setIsLoadingReports(false)
      }
    }
  }

  useEffect(() => {
    fetchReports()
  }, [selectedProfile])

  const handleRoleSwitch = (role: UserRole) => {
    const rolePath = role === "personal" ? "/personal" : role === "lab-owner" ? "/lab" : "/doctor"
    window.location.href = rolePath
  }

  const handleLogout = () => {
    localStorage.removeItem("userRoles")
    localStorage.removeItem("familyProfiles")
    localStorage.removeItem("healthReports")
    window.location.href = "/auth?view=login"
  }

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "personal":
        return <Activity className="h-4 w-4" />
      case "lab-owner":
        return <FileText className="h-4 w-4" />
      case "doctor":
        return <FileText className="h-4 w-4" />
    }
  }

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "personal":
        return "Personal"
      case "lab-owner":
        return "Lab Owner"
      case "doctor":
        return "Doctor"
    }
  }

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploadError(null)
    setPendingFiles(files)
    setUploadStep("select-profile")
  }

  const handleProfileSelectForUpload = (profile: FamilyProfile) => {
    setSelectedProfile(profile)
  }

  const handleCreateProfile = async (newProfile: NewProfilePayload) => {
    const token = getAccessToken()
    if (!token || isJwtExpired(token)) {
      redirectToLoginExpired()
      return
    }

    // Convert HTML date input (YYYY-MM-DD) to API expected format MM/dd/yyyy
    let apiDateOfBirth = newProfile.dateOfBirth
    if (newProfile.dateOfBirth.includes("-")) {
      const [yearStr, monthStr, dayStr] = newProfile.dateOfBirth.split("-")
      apiDateOfBirth = `${monthStr.padStart(2, "0")}/${dayStr.padStart(2, "0")}/${yearStr}`
    }

    try {
      const response = await fetch("/api/profile/create-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: newProfile.firstName,
          lastName: newProfile.lastName || "-",
          gender: newProfile.gender,
          dateOfBirth: apiDateOfBirth,
          phoneNumber: newProfile.phoneNumber,
          relationship: newProfile.relationship,
          roles: ["Personal"],
        }),
      })

      const data = await response.json()

      if (!response.ok || !data?.data) {
        console.error("Failed to create profile", data)
        return
      }

      const created = data.data

      const profile: FamilyProfile = {
        id: created.profile_id ?? Date.now().toString(),
        name: `${created.first_name ?? newProfile.firstName} ${created.last_name ?? newProfile.lastName}`.trim(),
        relationship: created.relationship || newProfile.relationship,
        age: calculateAge(created.date_of_birth || apiDateOfBirth),
        gender: (created.gender || newProfile.gender || "").toLowerCase(),
        color: PROFILE_COLORS[profiles.length % PROFILE_COLORS.length],
      }

      const updatedProfiles = [...profiles, profile]
      setProfiles(updatedProfiles)
      setSelectedProfile(profile)
    } catch (error) {
      console.error("Error creating profile:", error)
    }
  }

  const handleConfirmUpload = async () => {
    if (!selectedProfile || !pendingFiles) return

    const token = getAccessToken()
    if (!token) {
      setUploadError("You need to be logged in to upload a report.")
      return
    }

    // Create a processing report immediately
    const processingId = `processing-${Date.now()}`
    const processingReport: HealthReport = {
      id: processingId,
      name: "Processing your report",
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      lab: "Uploading...",
      profileId: selectedProfile.id,
      summary: [],
      parameters: [],
      isProcessing: true,
    }

    // Add processing report to the list immediately
    setReports([processingReport, ...reports])
    setProcessingReportId(processingId)
    setUploadStep("idle") // Keep UI showing reports list
    setIsUploading(true)

    try {
      const formData = new FormData()
      Array.from(pendingFiles).forEach((file) => {
        formData.append("files", file)
      })

      const response = await fetch("/api/report/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "Failed to upload report")
      }

      // Upload API returned 200 - immediately stop the processing loader
      setIsUploading(false)
      
      // Remove processing report immediately when upload succeeds
      // Use the local processingId variable (not state) to ensure we remove the correct report
      setReports((prev) => prev.filter((r) => r.id !== processingId))
      setProcessingReportId(null)

      const data = await response.json()

      // Basic mapping from API response to HealthReport shape
      const firstResult = data?.results?.[0]
      const uploadedReportId: string | undefined = firstResult?.report_id

      // Immediately attach this report to the currently selected profile
      if (uploadedReportId) {
        try {
          await fetch("/api/report/update-profile-id", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              report_id: uploadedReportId,
              profile_id: selectedProfile.id,
            }),
          })
        } catch (assignError) {
          console.error("Error assigning report to profile:", assignError)
          // Continue; UI will still show the uploaded report locally
        }
      }

      setPendingFiles(null)

      // Silently refresh reports from API to get the latest data with correct name
      // Pass processingId to excludeProcessingId to ensure it's not preserved
      // This will add the real report with the correct name
      await fetchReports(true, processingId)
    } catch (error) {
      console.error("Error uploading report:", error)
      // Remove processing report on error
      setReports((prev) => prev.filter((r) => r.id !== processingId))
      setProcessingReportId(null)
      setIsUploading(false)
      setUploadStep("idle")
      setUploadError("Something went wrong while uploading your report. Please try again.")
    }
  }

  const filteredReports = selectedProfile ? reports.filter((r) => r.profileId === selectedProfile.id) : reports

  const hasAnyReports = filteredReports.length > 0
  // Track if we've completed the initial data load (both profiles and reports)
  const isInitialLoadComplete = selectedProfile !== null && !isLoadingReports

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Activity className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">MedJourney.ai</span>
          </Link>

          <div className="flex items-center gap-4">
            {profiles.length > 0 && selectedProfile && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Avatar className={`h-5 w-5 ${selectedProfile?.color || "bg-primary"}`}>
                      <AvatarFallback className="text-[10px] text-white">
                        {selectedProfile ? getInitials(selectedProfile.name) : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">{selectedProfile?.name || "Select Profile"}</span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {profiles.map((profile) => (
                    <DropdownMenuItem
                      key={profile.id}
                      onClick={() => setSelectedProfile(profile)}
                      className={profile.id === selectedProfile?.id ? "bg-accent" : ""}
                    >
                      <Avatar className={`h-5 w-5 mr-2 ${profile.color}`}>
                        <AvatarFallback className="text-[10px] text-white">{getInitials(profile.name)}</AvatarFallback>
                      </Avatar>
                      <span>{profile.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground">{profile.relationship}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {roles.length > 1 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    {getRoleIcon("personal")}
                    <span className="hidden sm:inline">Personal</span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {roles.map((role) => (
                    <DropdownMenuItem
                      key={role}
                      onClick={() => handleRoleSwitch(role)}
                      className={role === "personal" ? "bg-accent" : ""}
                    >
                      {getRoleIcon(role)}
                      <span className="ml-2">{getRoleLabel(role)}</span>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="h-4 w-4" />
                      <span className="ml-2">Manage Roles</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button variant="ghost" size="sm" asChild>
              <Link href="/settings">
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {(!selectedProfile || isLoadingReports) && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
              <p className="text-muted-foreground">
                {!selectedProfile ? "Loading profiles..." : "Loading your health reports..."}
              </p>
            </div>
          </div>
        )}

        {isInitialLoadComplete && !hasAnyReports && uploadStep === "idle" && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                AI-Powered Health Insights
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">Start Your Personal Health Journey</h1>
              <p className="text-xl text-muted-foreground max-w-xl mx-auto text-balance">
                Upload your first health report and let our AI create a personalized summary and timeline of your health
                parameters.
              </p>
            </div>

            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="cursor-pointer block">
                  <div
                    className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 hover:bg-primary/5 transition-all"
                    onClick={() => fileInputInitialRef.current?.click()}
                  >
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Upload Your Health Report</h3>
                    <p className="text-muted-foreground mb-6">Drag and drop your report here, or click to browse</p>
                    <Button
                      size="lg"
                      className="gap-2"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        fileInputInitialRef.current?.click()
                      }}
                    >
                      <FileText className="h-5 w-5" />
                      Choose File
                    </Button>
                    <p className="text-xs text-muted-foreground mt-4">Supports PDF, JPG, PNG (Max 10MB)</p>
                    {uploadError && <p className="text-xs text-red-500 mt-2">{uploadError}</p>}
                  </div>
                  <input
                    ref={fileInputInitialRef}
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileSelect(e.target.files)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-card/50">
                <CardContent className="p-6 text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Smart Summary</h3>
                  <p className="text-sm text-muted-foreground">
                    Get an easy-to-understand summary of your medical reports in plain language
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50">
                <CardContent className="p-6 text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Health Timeline</h3>
                  <p className="text-sm text-muted-foreground">
                    Track how your health parameters change over time with visual charts
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50">
                <CardContent className="p-6 text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Family Profiles</h3>
                  <p className="text-sm text-muted-foreground">
                    Track health reports for your entire family with separate profiles
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {uploadStep === "select-profile" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">Who is this report for?</h1>
              <p className="text-muted-foreground">Select a personal or family profile for this report</p>
            </div>

            <ProfileSelector
              profiles={profiles}
              selectedProfile={selectedProfile}
              onSelectProfile={handleProfileSelectForUpload}
              onCreateProfile={handleCreateProfile}
            />

            <div className="flex justify-between gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setUploadStep("idle")
                  setPendingFiles(null)
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleConfirmUpload} disabled={!selectedProfile}>
                Continue with {selectedProfile?.name || "selected profile"}
              </Button>
            </div>
          </div>
        )}


        {isInitialLoadComplete && (hasAnyReports || isUploading) && uploadStep !== "select-profile" && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{selectedProfile?.name}'s Health Journey</h1>
                <p className="text-muted-foreground">
                  {filteredReports.length} report{filteredReports.length !== 1 ? "s" : ""} analyzed
                </p>
              </div>
              <Button className="gap-2" type="button" onClick={() => fileInputRef.current?.click()}>
                <Plus className="h-4 w-4" />
                Upload New Report
              </Button>
              <input
                ref={fileInputRef}
                id="file-upload-main"
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileSelect(e.target.files)}
              />
            </div>

            <Tabs defaultValue="reports" className="space-y-6">
              <TabsList>
                <TabsTrigger value="reports" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Reports
                </TabsTrigger>
                <TabsTrigger value="timeline" className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Timeline
                </TabsTrigger>
              </TabsList>

              <TabsContent value="reports">
                <ReportsList reports={filteredReports} />
              </TabsContent>

              <TabsContent value="timeline">
                <HealthTimeline />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}