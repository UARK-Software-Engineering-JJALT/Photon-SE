import { usePlayers } from "../utils/PlayersContext";

export default function ResetPlayersBtn() {
    const { setCurrPlayers } = usePlayers();
    
    return (
        <div className="flex flex-col gap-4 p-4">
            <button
                className="btn btn-primary"
                onClick={() => {
                    if (window.confirm("Are you sure you want to reset all players?")) {
                        setCurrPlayers([])
                        localStorage.removeItem("teamPlayers")
                    }
                }}
            >
                Reset Players
            </button>
        </div>
    );
}