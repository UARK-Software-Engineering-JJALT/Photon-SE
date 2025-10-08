"use client"
import { useState, useEffect } from "react"

export default function CountdownTimer( {matchTimeMinutes = 6, gameStarted = true})  {
    const [timeRemaining, settimeRemaining] = useState(matchTimeMinutes * 60)
    const [running, setRunning] = useState(gameStarted);
    
    useEffect(() => {
        if (!running) return;

        const interval = setInterval(() => {
            settimeRemaining(prev => {
                if (prev <= 1){
                    clearInterval(interval);
                    setRunning(false)
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
            {!gameStarted && <h3>Game Over</h3>}
        </div>
    );
}