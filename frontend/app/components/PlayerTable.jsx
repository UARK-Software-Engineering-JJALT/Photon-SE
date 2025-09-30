"use client"
import { useState } from "react"

export default function PlayerTable({ team, players, onRemove, onEdit, socketRef }) {
    const [editingHardwareId, setEditingHardwareId] = useState(null)
    const [hardwareInput, setHardwareInput] = useState("")

    const sendMessage = (msg) => {
        const ws = socketRef.current
        console.log("attempting to send", msg, ws?.readyState)
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(msg))
        } else {
            console.warn("Socket not open. Message not sent:", msg)
        }
    }



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
        sendMessage({
            type: "player_entry",
            payload: hwIdInt,
        })

        setEditingHardwareId(null)
        setHardwareInput("")
    }

    return (
    <div className="card w-full bg-base-100 shadow-md">
        <div className="card-body p-2">
            <div className="flex-1 overflow-x-auto rounded-box border bg-black">
                <h2
                    className={`text-xl font-bold p-2 ${team === "red" ? "text-red-500" : "text-green-500"
                        }`}
                >
                    {team.charAt(0).toUpperCase() + team.slice(1)} Team
                </h2>
                <table className="table w-full text-white">
                    <thead className="text-white">
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
        </div>
    </div>
    )
}
