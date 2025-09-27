"use client"
import { useEffect, useState } from "react"

export default function SplashScreen() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (typeof window === "undefined") return

    const hasSeenSplash = localStorage.getItem("splash") === "1"
    if (hasSeenSplash) {
      setVisible(false)
      return
    }

    const timer = setTimeout(() => {
      setVisible(false)
      localStorage.setItem("splash", "1")
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed z-50 inset-0 w-full h-full bg-white flex items-center justify-center">
      <img src="logo.jpg" alt="Logo" className="w-48 h-48 object-contain" />
    </div>
  )
}
