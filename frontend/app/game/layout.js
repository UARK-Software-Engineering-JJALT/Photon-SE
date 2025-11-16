import RandomMusicSelector from "../components/RandomMusicSelector";
import "../globals.css";

export default function GameLayout({ children }) {
    return (
        <>
            {children}
            <RandomMusicSelector />
        </>
    );
}