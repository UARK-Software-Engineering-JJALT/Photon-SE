"use client"
import { useEffect, useState } from "react"

export default function SplashScreen() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (typeof window === "undefined") return

    const timer = setTimeout(() => {
      setVisible(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div
  className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-center bg-no-repeat bg-contain"
  style={{ backgroundImage: "url('/logo.jpg')" }}
>
</div>

  )
}
