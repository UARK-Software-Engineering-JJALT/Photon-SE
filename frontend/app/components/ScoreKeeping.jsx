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
            try{
                const data = JSON.parse(event.data);
        if (data.type === "score_update"){
            setScores(data.payload);
        } else if (data.type === "player_update"){
            setPlayers(data.payload);
        }
        const updated = { ...scores };
        if (isRed(data.payload.id)) {
            updated.red = (updated.red || 0) + 1;
        }else if (isGreen(data.payload.id)) {
            updated.green = (updated.green || 0) + 1;
        }
        setScores(updated);
            }catch (error) {
                console.error("Error parsing WebSocket message:", error);
            }
        };
    }, [socketRef]);
    return null;
}