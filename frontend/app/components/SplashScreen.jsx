"use client"
import { useEffect, useState } from "react"

export default function SplashScreen() {
  const [visible, setVisible] = useState(true)
  const [render, setRender] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => setRender(false), 700)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  if (!render) return null

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-slate-800 z-50 
        transition-opacity duration-700 ease-in-out
        ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <h1
        className={`text-5xl font-bold text-amber-500 
          transform transition-all duration-700 ease-in-out
          ${visible ? "scale-100 animate-bounce" : "scale-90 opacity-0"}`}
      >
        Welcome to Photon!
      </h1>
    </div>
  )
}
