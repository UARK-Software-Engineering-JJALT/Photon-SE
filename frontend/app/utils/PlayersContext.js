import { useContext, createContext, useState, useEffect } from "react";

const PlayersContext = createContext(undefined);

export const PlayersProvider = ({children}) => {
    const [players, setPlayers] = useState(JSON.parse(localStorage.getItem("teamPlayers"))); // all players in session

    useEffect(() => {
        localStorage.setItem("teamPlayers", JSON.stringify(players))
    }, [players])
    

    const setCurrPlayers = (currPlayers) => {
        setPlayers(currPlayers);
    };

    const helperFunctions = {
        players,
        setCurrPlayers,
    };

    return(
        <PlayersContext.Provider value={helperFunctions}>
            {children}
        </PlayersContext.Provider>
    );
};

export const usePlayers = () => {
  const context = useContext(PlayersContext);
  if (context === undefined) {
    throw new Error('usePlayers must be used within an PlayersProvider');
  }
  return context;
};