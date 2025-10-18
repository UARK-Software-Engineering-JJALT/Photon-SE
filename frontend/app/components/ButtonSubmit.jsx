"use client"
import { useRouter } from "next/navigation"

export default function ButtonSubmit({ text }) {
  const router = useRouter()

  const handleClick = () => {
    router.push("/action-screen")
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <button onClick={handleClick} className="btn btn-primary">
        {text}
      </button>
    </div>
  )
}
