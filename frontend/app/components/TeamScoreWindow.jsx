"use client";

import { useEffect, useState } from "react";

export default function TeamScoreWindow({ teamColor }) {
    const [players, setPlayers] = useState([]);
    const [teamScore, setTeamScore] = useState(0);

    useEffect(() => {
        const storedPlayers = localStorage.getItem("teamPlayers");
        if (storedPlayers) {
            try {
                const allPlayers = JSON.parse(storedPlayers);
                const teamPlayers = allPlayers.filter(
                    (player) => player.team === teamColor
                );
                setPlayers(teamPlayers);

                const totalScore = teamPlayers.reduce(
                    (sum, player) => sum + (player.score || 0),
                    0
                );
                setTeamScore(totalScore);
            } catch (err) {
                console.error("Error parsing teamPlayers from localStorage:", err);
            }
        }
    }, [teamColor]);

    // consistent color scheme with amber header + team accent
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
                        className="flex justify-between items-center bg-base-300 rounded-lg px-4 py-2 shadow-sm"
                    >
                        <span className="font-semibold text-white">{player.alias}</span>
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
