"use client"
import { useState, useEffect } from "react"
import PlayerEntryForm from "./PlayerEntryForm"
import PlayerTable from "./PlayerTable"
import { usePlayers } from "../utils/PlayersContext"


export default function TeamManager({socketRef}) {
    const [editingPlayer, setEditingPlayer] = useState(null)
    const { players, setCurrPlayers } = usePlayers();

    // Load from localStorage on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const data = localStorage.getItem("teamPlayers")
            if (data) setCurrPlayers(JSON.parse(data))
        }
    }, [])

    // Save to localStorage whenever players change
    useEffect(() => {
        localStorage.setItem("teamPlayers", JSON.stringify(players))
    }, [players])

    const addOrUpdatePlayer = (newPlayer) => {
        setCurrPlayers((prev) => {
            const exists = prev.find((p) => p.id === newPlayer.id && p.team === newPlayer.team)
            if (exists) {
                // update existing
                return prev.map((p) =>
                    p.id === newPlayer.id && p.team === newPlayer.team ? newPlayer : p
                )
            }
            return [...prev, newPlayer]
        })
        setEditingPlayer(null)
    }

    const handleRemove = (id, team) => {
        setCurrPlayers((prev) => prev.filter((p) => !(p.id === id && p.team === team)))
    }

    const handleEdit = (id, team, hardwareId) => {
        setCurrPlayers((prev) =>
            prev.map((p) =>
                p.id === id && p.team === team ? { ...p, hardwareId: hardwareId ?? p.hardwareId } : p
            )
        )
    }

    return (
        <div className="mt-12 max-w-11/12 w-full flex flex-col gap-6 shadow-md">
            <PlayerEntryForm onSubmit={addOrUpdatePlayer} editingPlayer={editingPlayer} />
            <div className="flex gap-10">
                <PlayerTable
                    team="red"
                    players={players.filter((p) => p.team === "red")}
                    onRemove={handleRemove}
                    onEdit={handleEdit}
                    socketRef={socketRef}
                />
                <PlayerTable
                    team="green"
                    players={players.filter((p) => p.team === "green")}
                    onRemove={handleRemove}
                    onEdit={handleEdit}
                    socketRef={socketRef}
                />
            </div>
        </div>
    )
}
