import React, { useState, createContext, useMemo, useEffect, useContext } from 'react';
import { GameContextType, ISongs, player } from '@/@types/GameContext';
import { io } from 'socket.io-client';
import { authContext } from './AuthContext';
import { AuthContextType } from '@/@types/AuthContext';
import axios from 'axios';
export const gameContext = createContext<GameContextType | null>(null);
const socket = io('http://localhost:5000');
function GameProvider({ children }: { children: React.ReactNode }) {
  const { authState } = useContext(authContext) as AuthContextType;
  const [players, setPlayers] = useState<player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<player | null>(null);
  const [hasGameStarted, setHasGameStarted] = useState<boolean>(false);
  const [audio, setAudio] = useState(typeof Audio == 'undefined' ? null : new Audio());
  const [answer, setAnswer] = useState<string>('blinding lights - the weeknd');
  const [renderGame, setRenderGame] = useState<boolean>(false);
  const [time, setTime] = useState(1000);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>(null);
  const [audioTime, setAudioTime] = useState(0);
  const [value, setValue] = useState('');
  const [songs, setSongs] = useState<ISongs[]>([
    {
      value: 'Songs will appear here',
      label: 'Songs will appear here',
      key: 'no-song',
    },
  ]);

  let random: number;
  const addPlayer = (player: { _id: string; name: string }) => {
    if (players.find(p => p._id === player._id)) return;
    socket.emit('addPlayer', player);
    setPlayers([...players, player]);
  };

  const toggleGame = () => {
    random = Math.floor(Math.random() * players.length);
    const current_player = players[random];
    socket.emit('toggleGame', current_player);
    if (!hasGameStarted) {
      setCurrentPlayer(current_player);
    }
    setHasGameStarted(!hasGameStarted);
  };

  const handleChooseCategory = (category: string) => {
    socket.emit('chooseCategory', category);
    setAudio(new Audio(`/music/${category}.mp3`));
    handleAnswer('payphone - maroon 5');
    handleRenderGame();
  };

  const handleAnswer = (answer: string) => {
    setAnswer(answer);
  };

  const handleRenderGame = () => {
    setRenderGame(!renderGame);
  };

  const handleSkip = () => {
    console.log('handleSkip');
    let temporary_time: number = time;
    switch (time) {
      case 1000:
        temporary_time = 3000;
        setTime(temporary_time);
        break;
      case 3000:
        temporary_time = 6000;
        setTime(temporary_time);
        break;
      case 6000:
        temporary_time = 15000;
        setTime(temporary_time);
        break;
      case 15000:
        break;
      default:
        temporary_time = 1000;
        setTime(1000);
    }
    console.log(temporary_time);
    socket.emit('skip', temporary_time);
  };

  const handleAudioTimeUpdate = () => {
    if (!audio) return;
    setAudioTime(audio.currentTime);
  };

  const handlePlay = () => {
    if (!audio) return;

    if (currentPlayer?._id == authState._id) {
      socket.emit('handlePlay');
    }

    if (audio.currentTime >= time / 1000) audio.currentTime = 0;

    audio.paused ? audio.play() : audio.pause();
    if (intervalId !== null) clearInterval(intervalId); // Clear the previous interval
    const newIntervalId = setInterval(() => {
      if (audio.currentTime >= time / 1000) {
        audio.pause();
        clearInterval(newIntervalId);
      }
    }, 10);
    setIntervalId(newIntervalId);
  };

  const handleValueChange = (value: string) => {
    if (currentPlayer?._id == authState._id) {
      socket.emit('valueChange', value);
    }
    setValue(value);
  };

  const searchSong = async (query: string) => {
    if (query.length < 1) return;
    if (currentPlayer?._id == authState._id) {
      socket.emit('searchSong', query);
    }
    const response = axios.get(`http://localhost:5000/api/track/search/${query}`).then(res => {
      return res.data;
    });

    const data = await response;

    if (data.length > 0) {
      const temp_songs: ISongs[] = [];
      data.map((track: any) => {
        // Check if the song is already in the songs state
        if (temp_songs.find(song => song.key === track.url)) return;
        temp_songs.push({
          value: `${track.artist} - ${track.name}`,
          label: `${track.name} - ${track.artist}`,
          key: track.url,
        });
      });
      setSongs(temp_songs.slice(0, 8)); // Update the songs state with the new search results
    } else {
      setSongs([]); // Clear the songs state if there are no search results
    }
  };

  useEffect(() => {
    socket.on('addPlayer', (player: player) => {
      if (players.find(p => p._id === player._id)) return;
      setPlayers([...players, player]);
    });
    if (!players.find(p => p._id === authState._id)) return;
    socket.on('toggleGame', current_player => {
      if (!hasGameStarted) {
        setCurrentPlayer(current_player);
      }
      setHasGameStarted(!hasGameStarted);
    });
    socket.on('chooseCategory', (category: string) => {
      setAudio(new Audio(`/music/${category}.mp3`));
      setAnswer('payphone - maroon 5');
      handleRenderGame();
    });
    socket.on('skip', (time: number) => {
      console.log(time);
      setTime(time);
    });
    socket.on('valueChange', (value: string) => {
      handleValueChange(value);
    });
    socket.on('searchSong', (query: string) => {
      searchSong(query);
    });
  }, [players, audio, time, value, songs]);

  useEffect(() => {
    if (intervalId !== null) clearInterval(intervalId); // Clear the previous interval
    const newIntervalId = setInterval(() => {
      if (audio && audio.currentTime >= time / 1000) {
        audio.pause();
        clearInterval(newIntervalId);
      }
    }, 10);
    setIntervalId(newIntervalId); // Set the new interval ID
  }, [time]);

  useEffect(() => {
    socket.on('handlePlay', handlePlay);
    return () => {
      socket.off('handlePlay', handlePlay);
    };
  }, [handlePlay]);

  useEffect(() => {
    if (!audio) return;
    audio.addEventListener('timeupdate', handleAudioTimeUpdate);
    return () => {
      audio.removeEventListener('timeupdate', handleAudioTimeUpdate);
    };
  }, [audio]);

  const values = useMemo(
    () => ({
      players,
      addPlayer,
      hasGameStarted,
      toggleGame,
      handleChooseCategory,
      audio,
      answer,
      renderGame,
      currentPlayer,
      handleSkip,
      time,
      handlePlay,
      intervalId,
      setIntervalId,
      audioTime,
      value,
      handleValueChange,
      searchSong,
      songs,
    }),
    [
      players,
      hasGameStarted,
      audio,
      answer,
      renderGame,
      currentPlayer,
      time,
      intervalId,
      audioTime,
      value,
      songs,
    ],
  );
  return <gameContext.Provider value={values}>{children}</gameContext.Provider>;
}

export default GameProvider;
