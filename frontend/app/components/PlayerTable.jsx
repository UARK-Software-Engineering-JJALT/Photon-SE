"use client"
import { useState } from "react"

export default function PlayerTable({ team, players, onRemove, onEdit, socket }) {
    const [editingHardwareId, setEditingHardwareId] = useState(null)
    const [hardwareInput, setHardwareInput] = useState("")

    const startEdit = (player) => {
        setEditingHardwareId(player.id)
        setHardwareInput(player.hardwareId ?? "")
    }

    const saveHardwareId = (player) => {
        const hwIdInt = parseInt(hardwareInput)
        if (isNaN(hwIdInt)) {
            alert("Hardware ID must be a number")
            return
        }

        // Update DB via parent
        onEdit(player.id, player.team, hwIdInt)

        // Send WebSocket message
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(
                JSON.stringify({
                    type: "player_entry",
                    payload: hwIdInt,
                })
            )
        } else {
            console.warn("Socket not open. Could not send message.")
        }


        setEditingHardwareId(null)
        setHardwareInput("")
    }

    return (
        <div className="flex-1 overflow-x-auto rounded-box border bg-black">
            <h2
                className={`text-xl font-bold p-2 ${team === "red" ? "text-red-500" : "text-green-500"
                    }`}
            >
                {team.charAt(0).toUpperCase() + team.slice(1)} Team
            </h2>
            <table className="table w-full">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Alias</th>
                        <th>Hardware ID</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {players.map((p) => {
                        const isEditing = editingHardwareId === p.id
                        return (
                            <tr key={`${p.team}-${p.id}`}>
                                <td>{p.id}</td>
                                <td>{p.alias}</td>
                                <td>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            className="input input-sm w-20"
                                            value={hardwareInput}
                                            onChange={(e) => setHardwareInput(e.target.value)}
                                        />
                                    ) : (
                                        p.hardwareId ?? ""
                                    )}
                                </td>
                                <td className="flex gap-2">
                                    {isEditing ? (
                                        <button
                                            className="btn btn-xs btn-success"
                                            onClick={() => saveHardwareId(p)}
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-xs btn-outline"
                                            onClick={() => startEdit(p)}
                                        >
                                            Edit
                                        </button>
                                    )}
                                    <button
                                        className="btn btn-xs btn-error btn-outline"
                                        onClick={() => onRemove(p.id, p.team)}
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
