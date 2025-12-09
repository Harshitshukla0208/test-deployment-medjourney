"use client"

import type React from "react"

import { useEffect, useState } from "react"

type UserRole = "personal" | "lab-owner" | "doctor"

export function useUserRoles() {
  const [roles, setRoles] = useState<UserRole[]>(["personal"])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedRoles = localStorage.getItem("userRoles")
    if (storedRoles) {
      setRoles(JSON.parse(storedRoles))
    }
    setIsLoading(false)
  }, [])

  const hasRole = (role: UserRole) => roles.includes(role)
  const canViewLab = () => roles.includes("lab-owner")
  const canViewDoctor = () => roles.includes("doctor")
  const canViewPersonal = () => roles.includes("personal")

  return {
    roles,
    setRoles,
    hasRole,
    canViewLab,
    canViewDoctor,
    canViewPersonal,
    isLoading,
  }
}

export function RoleGate({ requiredRole, children }: { requiredRole: UserRole; children: React.ReactNode }) {
  const { hasRole, isLoading } = useUserRoles()

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading...</div>
  }

  if (!hasRole(requiredRole)) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground mb-4">You don't have access to this section.</p>
        <p className="text-xs text-muted-foreground">Enable this role in your settings.</p>
      </div>
    )
  }

  return <>{children}</>
}


