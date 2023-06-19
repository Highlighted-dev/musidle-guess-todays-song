import React, { useState, createContext, useMemo, useEffect } from 'react';
import { GameContextType, player } from '@/@types/GameContext';
import { io } from 'socket.io-client';
export const gameContext = createContext<GameContextType | null>(null);
const socket = io('http://localhost:5000');
function GameProvider({ children }: { children: React.ReactNode }) {
  const [players, setPlayers] = useState<player[]>([]);
  const [hasGameStarted, setHasGameStarted] = useState<boolean>(false);

  const addPlayer = (player: { _id: string; name: string }) => {
    // If player is already in players array, return
    if (players.find(p => p._id === player._id)) return;
    socket.emit('addPlayer', player);
    setPlayers([...players, player]);
  };
  const toggleGame = () => {
    socket.emit('toggleGame');
    setHasGameStarted(!hasGameStarted);
  };

  useEffect(() => {
    socket.on('addPlayer', (player: player) => {
      setPlayers([...players, player]);
    });
    socket.on('toggleGame', () => {
      setHasGameStarted(!hasGameStarted);
    });
  }, [players, hasGameStarted]);

  const values = useMemo(
    () => ({ players, addPlayer, hasGameStarted, toggleGame }),
    [players, hasGameStarted],
  );
  return <gameContext.Provider value={values}>{children}</gameContext.Provider>;
}

export default GameProvider;
