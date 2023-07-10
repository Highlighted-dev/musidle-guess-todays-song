import React, { useState, createContext, useMemo, useEffect, useContext, useRef } from 'react';
import { GameContextType, ISongs, player } from '@/@types/GameContext';
import { io } from 'socket.io-client';
import { authContext } from './AuthContext';
import { AuthContextType } from '@/@types/AuthContext';
import axios from 'axios';

export const gameContext = createContext<GameContextType | null>(null);
const socket = io(
  process.env.NODE_ENV == 'production'
    ? process.env.NEXT_PUBLIC_API_HOST!
    : 'http://localhost:5000',
);
function GameProvider({ children }: { children: React.ReactNode }) {
  const { authState } = useContext(authContext) as AuthContextType;
  const [players, setPlayers] = useState<player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<player | null>(null);
  const [hasPhaseOneStarted, setHasPhaseOneStarted] = useState<boolean>(false);
  const [hasPhaseTwoStarted, setHasPhaseTwoStarted] = useState<boolean>(false);
  const [hasPhaseThreeStarted, setHasPhaseThreeStarted] = useState<boolean>(false);
  const [audio, setAudio] = useState(typeof Audio == 'undefined' ? null : new Audio());
  const [answer, setAnswer] = useState<string>('');
  const [renderGame, setRenderGame] = useState<boolean>(false);
  const [time, setTime] = useState(1000);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>(null);
  const [audioTime, setAudioTime] = useState(0);
  const [value, setValue] = useState('');
  const submitRef = useRef<HTMLButtonElement>(null);
  const [songs, setSongs] = useState<ISongs[]>([
    {
      value: 'Songs will appear here',
      label: 'Songs will appear here',
      key: 'no-song',
    },
  ]);
  const [round, setRound] = useState<number>(0);
  const [maxRounds, setMaxRounds] = useState<number>(2);

  let random: number;
  const addPlayer = (player: { _id: string; name: string; score: number }) => {
    if (players.find(p => p._id === player._id)) return;
    socket.emit('addPlayer', player);
    setPlayers([...players, player]);
  };

  const togglePhaseOne = () => {
    random = Math.floor(Math.random() * players.length);
    const current_player = players[random];
    socket.emit('togglePhaseOne', current_player);
    if (!hasPhaseOneStarted) {
      setCurrentPlayer(current_player);
    }
    setHasPhaseOneStarted(!hasPhaseOneStarted);
  };

  const handleChooseCategory = (category: string) => {
    socket.emit('chooseCategory', category);
    setAudio(new Audio(`/music/${category}.mp3`));
    handleAnswer('Payphone - Maroon 5');
    handleRenderGame();
  };

  const handleChooseArtist = (artist: string) => {
    socket.emit('chooseArtist', artist);
    setAudio(new Audio(`/music/${artist}.mp3`));
    handleAnswer('Blinding Lights - The Weeknd');
    handleRenderGame();
  };

  const handleFinal = () => {
    socket.emit('handleFinal');
    if (currentPlayer) {
      //Get the player with the highest score
      const finalist = players.reduce((prev, current) =>
        prev.score > current.score ? prev : current,
      );
      setCurrentPlayer(finalist);
    }
    setAudio(new Audio(`/music/final1.mp3`));
    handleAnswer('Payphone - Maroon 5');
  };

  const handleAnswer = (answer: string) => {
    setAnswer(answer);
  };

  const handleRenderGame = () => {
    setRenderGame(!renderGame);
  };

  const handleSkip = () => {
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

    const response = axios.get(`http://localhost:5000/api/track/search/${query}`).then(res => {
      return res.data;
    });

    const data = await response;
    const temp_songs: ISongs[] = [];
    if (data.length > 0) {
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
    if (currentPlayer?._id == authState._id) {
      socket.emit('searchSong', temp_songs.slice(0, 8));
    }
  };

  const handleAnswerSubmit = () => {
    if (!currentPlayer) return;
    if (audio) audio.pause();
    let points = 0;
    if (value && value.toLowerCase() == answer.toLowerCase()) {
      switch (time) {
        case 1000:
          points = 500;
          break;
        case 3000:
          points = 400;
          break;
        case 6000:
          points = 300;
          break;
        case 15000:
          points = 100;
          break;
        default:
          points = 0;
      }
    }
    updatePlayerScore(points, currentPlayer);
    if (currentPlayer?._id == authState._id) {
      socket.emit('answerSubmit', points, currentPlayer);
    }
  };

  const updatePlayerScore = (points: number, player: player) => {
    const temp_players = players.map(p => {
      if (p._id === player._id) {
        p.score += points;
      }
      return p;
    });
    setPlayers(temp_players);
  };

  const handleTurnChange = () => {
    if (!currentPlayer) return;
    if (currentPlayer?._id == authState._id) {
      socket.emit('turnChange');
    }

    const index = players.findIndex(p => p._id === currentPlayer._id);
    if (index === players.length - 1) {
      setCurrentPlayer(players[0]);
    } else {
      setCurrentPlayer(players[index + 1]);
    }
    if (intervalId !== null) clearInterval(intervalId);
    setAudioTime(0);
    setAudio(null);
    setValue('');
    setAnswer('');
    setTime(1000);
    setSongs([
      {
        value: 'Songs will appear here',
        label: 'Songs will appear here',
        key: 'no-song',
      },
    ]);
    setRenderGame(false);
    // As we update the round state later, the actual round is the current round + 1
    if (maxRounds === round + 1) {
      if (hasPhaseOneStarted) {
        setHasPhaseTwoStarted(true);
        setHasPhaseOneStarted(false);
      } else {
        handleFinal();
        setHasPhaseTwoStarted(false);
        setHasPhaseThreeStarted(true);
      }
      return setRound(0);
    }
    setRound(round + 1);
  };

  useEffect(() => {
    socket.on('addPlayer', (player: player) => {
      if (players.find(p => p._id === player._id)) return;
      setPlayers([...players, player]);
    });
    if (!players.find(p => p._id === authState._id)) return;
    socket.on('togglePhaseOne', current_player => {
      if (!hasPhaseOneStarted) {
        setCurrentPlayer(current_player);
      }
      setHasPhaseOneStarted(!hasPhaseOneStarted);
    });
    socket.on('chooseCategory', (category: string) => {
      setAudio(new Audio(`/music/${category}.mp3`));
      setAnswer('payphone - maroon 5');
      handleRenderGame();
    });
    socket.on('chooseArtist', (artist: string) => {
      setAudio(new Audio(`/music/${artist}.mp3`));
      handleAnswer('Blinding Lights - The Weeknd');
      handleRenderGame();
    });
    socket.on('skip', (time: number) => {
      setTime(time);
    });
  }, [players, audio, time]);

  useEffect(() => {
    socket.on('turnChange', () => {
      handleTurnChange();
    });
    return () => {
      socket.off('turnChange');
    };
  }, [currentPlayer]);

  useEffect(() => {
    socket.on('searchSong', songs => {
      setSongs(songs);
    });
    return () => {
      socket.off('searchSong');
    };
  }, [songs]);

  useEffect(() => {
    socket.on('valueChange', (value: string) => {
      handleValueChange(value);
    });
    return () => {
      socket.off('valueChange');
    };
  }, [value]);

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
    socket.on('answerSubmit', (score: number, player: player) => {
      updatePlayerScore(score, player);
      if (submitRef.current) {
        submitRef.current.click();
      }
    });
    return () => {
      socket.off('answerSubmit');
    };
  }, [submitRef]);

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
      hasPhaseOneStarted,
      togglePhaseOne,
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
      handleAnswerSubmit,
      submitRef,
      handleTurnChange,
      hasPhaseTwoStarted,
      hasPhaseThreeStarted,
      handleChooseArtist,
    }),
    [
      players,
      hasPhaseOneStarted,
      hasPhaseTwoStarted,
      hasPhaseThreeStarted,
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
