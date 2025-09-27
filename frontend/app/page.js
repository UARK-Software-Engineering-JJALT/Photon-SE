import SplashScreen from "./components/SplashScreen"
import TeamManager from "./components/TeamManager"
import WebsocketStatus from "./components/WebsocketStatus"

export default function Home() {
  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center">
      <SplashScreen />

      <div className="absolute top-4 right-4">
        <WebsocketStatus />
      </div>

      <h1 className="text-4xl font-bold text-amber-500">Enter Players</h1>
      <TeamManager />

      <TeamManager />
    </div>
  )
}
