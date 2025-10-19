"use client"
import { CountdownTimer } from "../components/CountdownTimer.jsx"
import { useRouter } from "next/navigation"

export default function Countdown({ text }) {
  const router = useRouter();

  const handleFinish = () => {
    router.push("/action-screen")
  };

  return CountdownTimer(0, 30, false, handleFinish, null);
}