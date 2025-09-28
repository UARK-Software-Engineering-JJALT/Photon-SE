export default function WebsocketStatus({ status }) {
  const colors = {
    connecting: "text-yellow-500",
    connected: "text-green-500",
    disconnected: "text-red-500",
    error: "text-red-700",
  }

  return (
    <div className={`font-bold ${colors[status] || "text-gray-500"}`}>
      {status}
    </div>
  )
}
