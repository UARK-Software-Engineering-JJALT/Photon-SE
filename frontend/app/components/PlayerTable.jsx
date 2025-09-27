"use client"

export default function PlayerTable({ players, onRemove, onEdit }) {
  return (
    <div className="overflow-x-auto rounded-box border bg-black">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Alias</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id}>
              <td>{player.id}</td>
              <td>{player.alias}</td>
              <td className="flex gap-2">
                <button
                  onClick={() => onEdit(player.id)}
                  className="btn btn-xs btn-info"
                >
                  Edit
                </button>
                <button
                  onClick={() => onRemove(player.id)}
                  className="btn btn-xs btn-error"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
