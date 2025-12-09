"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMemo } from "react"

export type PortalView = "personal" | "lab-owner" | "doctor"

const viewOptions: Array<{ value: PortalView; label: string }> = [
  { value: "personal", label: "Personal Portal" },
  { value: "lab-owner", label: "Lab Owner Portal" },
  { value: "doctor", label: "Doctor Portal" },
]

export function PortalSwitcher({ currentView }: { currentView: PortalView }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const params = useMemo(() => {
    const next = new URLSearchParams(searchParams?.toString())
    // Ensure view param exists so replace() always includes it
    if (!next.get("view")) {
      next.set("view", currentView)
    }
    return next
  }, [searchParams, currentView])

  function handleChange(value: PortalView) {
    const next = new URLSearchParams(params)
    next.set("view", value)
    router.replace(`/dashboard?${next.toString()}`, { scroll: false })
  }

  return (
    <Select value={currentView} onValueChange={handleChange}>
      <SelectTrigger className="w-[190px]">
        <SelectValue placeholder="Select portal" />
      </SelectTrigger>
      <SelectContent align="end">
        {viewOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

