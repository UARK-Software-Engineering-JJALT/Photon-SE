export default function ResetPlayersBtn({ onReset }) {
    return (
        <button
            className="btn btn-warning btn-sm"
            onClick={() => {
                if (window.confirm("Are you sure you want to reset all players?")) {
                    onReset()
                }
            }}
        >
            Reset Players
        </button>
    );
}