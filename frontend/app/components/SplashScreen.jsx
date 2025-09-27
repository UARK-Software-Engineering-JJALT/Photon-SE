"use client"
import { useEffect, useState } from "react"

export default function SplashScreen() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      localStorage.setItem("splash", 1)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!visible || localStorage.getItem("splash") == 1) return null

  return (
    <div className="fixed z-50 inset-0 w-full h-full show-outline">
      <img src="logo.jpg" className="w-fit h-fit bg-blend-color-burn" />
    </div>
  )
}
