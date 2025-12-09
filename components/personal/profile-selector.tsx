"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plus, Check, Users } from "lucide-react"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { format } from "date-fns"

export interface FamilyProfile {
  id: string
  name: string
  relationship: string
  age: number
  gender: string
  color: string
}

interface ProfileSelectorProps {
  profiles: FamilyProfile[]
  selectedProfile: FamilyProfile | null
  onSelectProfile: (profile: FamilyProfile) => void
  onCreateProfile: (profile: {
    firstName: string
    lastName: string
    relationship: string
    gender: string
    dateOfBirth: string
    phoneNumber?: string
  }) => Promise<void> | void
}

const relationshipOptions = ["Self", "Mother", "Father", "Spouse", "Child", "Sibling", "Friend", "Other"]

export function ProfileSelector({ profiles, selectedProfile, onSelectProfile, onCreateProfile }: ProfileSelectorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newProfile, setNewProfile] = useState({
    firstName: "",
    lastName: "",
    relationship: "",
    customRelationship: "",
    gender: "",
    dateOfBirth: null as Date | null,
    phoneNumber: "",
  })

  const handleCreateProfile = async () => {
    if (
      newProfile.firstName &&
      newProfile.lastName &&
      newProfile.relationship &&
      newProfile.gender &&
      newProfile.dateOfBirth
    ) {
      const relationshipToSend =
        newProfile.relationship === "Other" && newProfile.customRelationship
          ? newProfile.customRelationship
          : newProfile.relationship

      if (!relationshipToSend) return

      const formattedDob =
        newProfile.dateOfBirth && !Number.isNaN(newProfile.dateOfBirth.getTime())
          ? format(newProfile.dateOfBirth, "yyyy-MM-dd")
          : ""

      if (!formattedDob) return

      await onCreateProfile({
        firstName: newProfile.firstName,
        lastName: newProfile.lastName,
        relationship: relationshipToSend,
        gender: newProfile.gender,
        dateOfBirth: formattedDob,
        phoneNumber: newProfile.phoneNumber || undefined,
      })
      setNewProfile({
        firstName: "",
        lastName: "",
        relationship: "",
        customRelationship: "",
        gender: "",
        dateOfBirth: null,
        phoneNumber: "",
      })
      setIsDialogOpen(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Who is this report for?</CardTitle>
            <CardDescription>Select a personal or family profile or create a new one</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              onClick={() => onSelectProfile(profile)}
              className={`relative p-4 rounded-xl border-2 transition-all text-left hover:border-primary/50 ${
                selectedProfile?.id === profile.id ? "border-primary bg-primary/5" : "border-border bg-card"
              }`}
            >
              {selectedProfile?.id === profile.id && (
                <div className="absolute top-2 right-2">
                  <Check className="h-4 w-4 text-primary" />
                </div>
              )}
              <Avatar className={`h-12 w-12 mb-3 ${profile.color}`}>
                <AvatarFallback className="text-white font-medium">{getInitials(profile.name)}</AvatarFallback>
              </Avatar>
              <p className="font-medium text-foreground truncate">{profile.name}</p>
              <p className="text-xs text-muted-foreground">{profile.relationship}</p>
            </button>
          ))}

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button className="p-4 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center min-h-[120px]">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="font-medium text-muted-foreground text-sm">Add Profile</p>
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Personal Profile</DialogTitle>
                <DialogDescription>
                  Create a profile for yourself or a family member to track their health reports separately.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">
                      First Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="Enter first name"
                      value={newProfile.firstName}
                      onChange={(e) => setNewProfile({ ...newProfile, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">
                      Last Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Enter last name"
                      value={newProfile.lastName}
                      onChange={(e) => setNewProfile({ ...newProfile, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relationship">
                    Relationship <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={newProfile.relationship}
                    onValueChange={(value) =>
                      setNewProfile({
                        ...newProfile,
                        relationship: value,
                        // reset custom when switching away from Other
                        customRelationship: value === "Other" ? newProfile.customRelationship : "",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      {relationshipOptions.map((rel) => (
                        <SelectItem key={rel} value={rel}>
                          {rel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {newProfile.relationship === "Other" && (
                    <div className="space-y-2 pt-2">
                      <Label htmlFor="customRelationship">
                        Specify Relationship <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="customRelationship"
                        placeholder="Type relationship (e.g., Cousin, Grandfather)"
                        value={newProfile.customRelationship}
                        onChange={(e) =>
                          setNewProfile({
                            ...newProfile,
                            customRelationship: e.target.value,
                          })
                        }
                      />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">
                      Date of Birth <span className="text-destructive">*</span>
                    </Label>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <div className="rounded-lg border border-border px-3 py-1 bg-background">
                        <DatePicker
                          value={newProfile.dateOfBirth}
                          onChange={(date) => setNewProfile({ ...newProfile, dateOfBirth: date })}
                          format="dd/MM/yyyy"
                          slotProps={{
                            textField: {
                              variant: "standard",
                              fullWidth: true,
                              placeholder: "DD/MM/YYYY",
                              InputProps: {
                                disableUnderline: true,
                              },
                              sx: {
                                "& .MuiInputBase-root": {
                                  border: "none",
                                  padding: 0,
                                  height: "42px",
                                  fontSize: "0.9rem",
                                },
                                "& .MuiInputBase-input": {
                                  padding: 0,
                                  color: "#0f172a",
                                  fontSize: "0.9rem",
                                },
                                "& .MuiInputBase-input::placeholder": {
                                  color: "#94a3b8",
                                  opacity: 1,
                                  fontSize: "0.85rem",
                                },
                                "& .MuiSvgIcon-root": {
                                  fontSize: "1rem",
                                },
                              },
                            },
                          }}
                        />
                      </div>
                    </LocalizationProvider>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">
                      Gender <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={newProfile.gender}
                      onValueChange={(value) => setNewProfile({ ...newProfile, gender: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
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
                  <Label htmlFor="phoneNumber">Phone Number (optional)</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Enter phone number"
                    value={newProfile.phoneNumber}
                    onChange={(e) => setNewProfile({ ...newProfile, phoneNumber: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateProfile}
                  disabled={
                    !newProfile.firstName ||
                    !newProfile.lastName ||
                    !newProfile.relationship ||
                    (newProfile.relationship === "Other" && !newProfile.customRelationship) ||
                    !newProfile.gender ||
                    !newProfile.dateOfBirth
                  }
                >
                  Create Profile
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}


