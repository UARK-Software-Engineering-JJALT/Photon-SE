"use client"
import { useState, useEffect } from "react"
import PlayerEntryForm from "./PlayerEntryForm"
import PlayerTable from "./PlayerTable"

const LOCAL_STORAGE_KEY = "teamPlayers"

export default function TeamManager({socket}) {
    const [players, setPlayers] = useState([]) // all players in session
    const [editingPlayer, setEditingPlayer] = useState(null)

    // Load from localStorage on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const data = localStorage.getItem(LOCAL_STORAGE_KEY)
            if (data) setPlayers(JSON.parse(data))
        }
    }, [])

    // Save to localStorage whenever players change
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(players))
    }, [players])

    const addOrUpdatePlayer = (newPlayer) => {
        setPlayers((prev) => {
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
        setPlayers((prev) => prev.filter((p) => !(p.id === id && p.team === team)))
    }

    const handleEdit = (id, team, hardwareId) => {
        setPlayers((prev) =>
            prev.map((p) =>
                p.id === id && p.team === team ? { ...p, hardwareId: hardwareId ?? p.hardwareId } : p
            )
        )
    }

    return (
        <div className="mt-12 max-w-3/4 w-full flex flex-col gap-6">
            <PlayerEntryForm onSubmit={addOrUpdatePlayer} editingPlayer={editingPlayer} />
            <div className="flex gap-10">
                <PlayerTable
                    team="red"
                    players={players.filter((p) => p.team === "red")}
                    onRemove={handleRemove}
                    onEdit={handleEdit}
                    socket={socket}
                />
                <PlayerTable
                    team="green"
                    players={players.filter((p) => p.team === "green")}
                    onRemove={handleRemove}
                    onEdit={handleEdit}
                />
            </div>
        </div>
    )
}
