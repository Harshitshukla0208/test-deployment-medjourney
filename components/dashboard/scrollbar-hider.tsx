"use client"

import { useEffect } from "react"

export function ScrollbarHider() {
  useEffect(() => {
    // Add class to body to hide scrollbar
    document.body.classList.add("hide-scrollbar")
    document.documentElement.classList.add("hide-scrollbar")

    // Cleanup on unmount
    return () => {
      document.body.classList.remove("hide-scrollbar")
      document.documentElement.classList.remove("hide-scrollbar")
    }
  }, [])

  return null
}

