"use client"
import { useRouter } from "next/navigation"

export default function ButtonSubmit() {
  const router = useRouter()

  const handleClick = () => {
    router.push("/action-screen")
  }

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg">
      <button onClick={handleClick} className="btn btn-primary">
        Submit
      </button>
    </div>
  )
}
