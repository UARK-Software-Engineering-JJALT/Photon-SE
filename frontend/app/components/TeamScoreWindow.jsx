"use client";

import { useEffect, useState } from "react";

export default function TeamScoreWindow({ teamColor, latestMessage }) {
    const [players, setPlayers] = useState([]);
    const [teamScore, setTeamScore] = useState(0);
    
    //team consts
    const isRed = (hardwareId) => parseInt(hardwareId) % 2 === 0;
    const isGreen = (hardwareId) => parseInt(hardwareId) % 2 === 1;

    //load players
    useEffect(() => {
        const storedPlayers = localStorage.getItem("teamPlayers");
        if (storedPlayers) {
            try {
                const allPlayers = JSON.parse(storedPlayers);
                let teamPlayers;
                if (teamColor === "red") {
                  teamPlayers = allPlayers.filter((player) => isRed(player.hardwareId));
                } else {
                  teamPlayers = allPlayers.filter((player) => isGreen(player.hardwareId));
                }

                setPlayers(teamPlayers);

                let totalScore = 0;
                for (const player of teamPlayers) {
                  totalScore += player.score || 0;
                }

                setTeamScore(totalScore);
            } catch (err) {
                console.error("Error parsing teamPlayers from localStorage:", err);
            }
        }
    }, [teamColor]);

    //handle incoming messages/game state updates
    useEffect(() => {
      if (!latestMessage) return;
      try {
        const data = JSON.parse(latestMessage);
        if (data.type !== "udp_message") return;

        const parts = data.payload.split(":");
        let attacker, victim, eventCode;

        //"2:3"
        if (parts.length === 2) {
          [attacker, victim] = parts;
          eventCode = null;
        //2:3:43
        } else if (parts.length === 3) {
          [attacker, victim, eventCode] = parts;
        }

        const storedPlayers = localStorage.getItem("teamPlayers");
        let allPlayers = storedPlayers ? JSON.parse(storedPlayers) : [];

        if (!storedPlayers) {
          allPlayers = [attacker, victim].map((id) => ({
            id,
            alias: `Player ${id}`,
            score: 0,
          }));
        }

        const updatedPlayers = allPlayers.map((player) => {
          let score = player.score || 0;

          if (parseInt(player.id) === parseInt(attacker)) {
            if (eventCode === "53" && isGreen(attacker)) {
              score += 100;
              return { ...player, score, baseHit: true };
            } else if (eventCode === "43" && isRed(attacker)) {
              score += 100;
              return { ...player, score, baseHit: true }; 
            } else {
              // normal hit
              score += 10;
              return { ...player, score, baseHit: player.baseHit }; 
            }
          }

          if (parseInt(player.id) === parseInt(victim) 
            && parseInt(attacker) !== parseInt(victim) 
            && isRed(attacker) === isRed(victim)
          ) {
            score -= 10;
          }

          return { ...player, score, baseHit: player.baseHit || false };
        });

        localStorage.setItem("teamPlayers", JSON.stringify(updatedPlayers));

        let teamPlayers;
        if (teamColor === "red") {
          teamPlayers = updatedPlayers.filter(p => isRed(p.hardwareId));
        } else {
          teamPlayers = updatedPlayers.filter(p => isGreen(p.hardwareId));
        }

        teamPlayers.sort((a, b) => {
          const scoreA = a.score || 0;
          const scoreB = b.score || 0;

          if (scoreA < scoreB) return 1;   // b comes before a
          if (scoreA > scoreB) return -1;  // a comes before b
          return 0;                        // equal scores
        });

        setPlayers(teamPlayers);

        const totalScore = teamPlayers.reduce(
          (sum, player) => sum + (player.score || 0),
          0
        );
        setTeamScore(totalScore);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    }, [latestMessage]);

    const teamText =
        teamColor === "red"
            ? "text-red-500"
            : teamColor === "green"
                ? "text-green-500"
                : "text-gray-500";

    return (
        <div
            className={`w-80 bg-black border-2 border-white rounded-2xl shadow-lg p-5 m-3`}
        >
            <h2 className={`text-2xl font-bold ${teamText} text-center capitalize`}>
                {teamColor} Team
            </h2>
            <div className="divider divider-amber my-3"></div>

            <ul className="space-y-3">
                {players.map((player) => (
                    <li
                        key={player.id}
                        className="flex justify-between items-center bg-slate-600 rounded-lg px-4 py-2 shadow-sm"
                    >
                        <span className="font-semibold text-white flex items-center gap-2">
                            {player.baseHit && (
                                <img src="/baseicon.jpg" alt="Base Icon" className="w-5 h-5 inline-block" />
                            )}
                            {player.alias}
                        </span>
                        <span className="text-amber-400 font-bold text-lg">
                            {player.score ?? 0}
                        </span>
                    </li>
                ))}
            </ul>

            <div className="divider divider-amber my-4"></div>

            <div className="flex justify-between items-center text-lg font-bold text-white">
                <span>Total Score</span>
                <span className="text-amber-500">{teamScore}</span>
            </div>
        </div>
    );
}