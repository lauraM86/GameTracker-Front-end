import { createContext, useState, useContext } from "react";

const GameContext = createContext();
export const useGameContext = () => useContext(GameContext);

export function GameProvider({ children }) {
  const [library, setLibrary] = useState([]); 

  const addToLibrary = (game) => {
    
    if (!library.find(g => g.id === game.id)) {
      setLibrary([...library, game]);
    }
  };

  return (
    <GameContext.Provider value={{ library, addToLibrary }}>
      {children}
    </GameContext.Provider>
  );
}
