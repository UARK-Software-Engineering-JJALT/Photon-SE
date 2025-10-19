"use client"
import { useState, useEffect } from "react"
// func and whenFinished are arguments for the function to run once the timer is 0
// and the value for that function to use respectively

export default function CountdownTimer( {matchTimeMinutes = 6, matchTimeSeconds = 0, gameStarted = true, func, whenFinished})  {
    const [timeRemaining, settimeRemaining] = useState(matchTimeMinutes * 60 + matchTimeSeconds)
    const [running, setRunning] = useState(gameStarted);
    
    useEffect(() => {
        if (!running) return;

        const interval = setInterval(() => {
            settimeRemaining(prev => {
                if (prev <= 1){
                    clearInterval(interval);
                    setRunning(false)
                    whenFinished()
                    return 0;
                }
                return prev - 1;
            });
        },1000);
        return () => clearInterval(interval);
    }, [running]);
    
    
    const minutes = String(Math.floor(timeRemaining / 60)).padStart(2, "0");
    const seconds = String(timeRemaining % 60).padStart(2, "0");

    return (
        <div style={{
        fontFamily: "Arial, sans-serif",
        fontSize: "48px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        color: "#ff580f"
      }}>
            <h2>{minutes}:{seconds}</h2>
        </div>
    );
}