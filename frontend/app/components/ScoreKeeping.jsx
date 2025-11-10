import { useState, useEffect } from 'react'

export default function ScoreKeeping({ socketRef }) {
    const [scores, setScores] = useState({});
    const [players, setPlayers] = useState({});
    const isRed = (id) => ["202", "203"].includes(id);
    const isGreen = (id) => ["220", "221"].includes(id);

    useEffect(() => {
    if (!socketRef?.current) return;

    const ws = socketRef.current;

    ws.onmessage = (event) => {
        try {
        const data = JSON.parse(event.data);

        if (data.type === "udp_message") {
            const [attacker] = data.payload.split(":");

            setScores(prev => {
            const updated = { ...prev };
            if (isRed(attacker)) updated.red = (updated.red || 0) + 1;
            else if (isGreen(attacker)) updated.green = (updated.green || 0) + 1;

            const updatedPlayers = [
                { id: "202", team: "red", score: updated.red || 0, alias: "Red 1" },
                { id: "203", team: "red", score: updated.red || 0, alias: "Red 2" },
                { id: "220", team: "green", score: updated.green || 0, alias: "Green 1" },
                { id: "221", team: "green", score: updated.green || 0, alias: "Green 2" },
            ];

            setPlayers(updatedPlayers); 
            localStorage.setItem("teamPlayers", JSON.stringify(updatedPlayers));

            return updated;
            });

        }
        } catch (error) {
        console.error("Error parsing WebSocket message:", error);
        }
    };
    }, [socketRef]);

        return null;
}