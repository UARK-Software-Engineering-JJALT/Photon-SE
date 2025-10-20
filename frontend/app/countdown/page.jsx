"use client"
import CountdownTimer from "../components/CountdownTimer.jsx"
import { useRouter } from "next/navigation"

export default function Countdown({ text }) {
  const router = useRouter();

  //Causes error on Dev builds for reasons I have yet to understand
  //but otherwise does the job it sets out to do
  const handleFinish = (_) => {
    router.push("/action-screen")
  };

  return (
    <div style={{
        fontFamily: "Arial, sans-serif",
        fontSize: "96px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        color: "#ffffffff"
    }}>
        <h1>Setup</h1>
        {CountdownTimer({matchTimeMinutes : 0, matchTimeSeconds : 30, gameStarted : true, func : handleFinish, whenFinished : null})}
    </div>
  )
}