import React, { useState, createContext, useMemo, useEffect, useContext, useRef } from 'react';
import { GameContextType, ISongs, player } from '@/@types/GameContext';
import { io } from 'socket.io-client';
import { authContext } from './AuthContext';
import { AuthContextType } from '@/@types/AuthContext';
import axios from 'axios';
import useTimerStore from '@/stores/TimerStore';
import { useRouter } from 'next/navigation';
export const gameContext = createContext<GameContextType | null>(null);
const socket = io(
  process.env.NODE_ENV == 'production'
    ? process.env.NEXT_PUBLIC_API_HOST!
    : 'http://localhost:5000',
);
function GameProvider({ children }: { children: React.ReactNode }) {
  const { authState } = useContext(authContext) as AuthContextType;
  const {
    timer,
    setTimer,
    isTimerRunning,
    setIsTimerRunning,
    timerIntervalId,
    setTimerIntervalId,
  } = useTimerStore();
  const [players, setPlayers] = useState<player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<player | null>(null);
  const [roomId, setRoomId] = useState<string>('');
  const [isInLobby, setIsInLobby] = useState<boolean>(false);
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

  const router = useRouter();

  const handleRoomJoin = async (room_id: string) => {
    if (!authState._id) return;
    const { data } = await axios.post(`/api/rooms/join`, {
      room_id,
      player: {
        _id: authState._id,
        name: authState.username,
        score: 0,
      },
    });
    setRoomId(room_id);
    setPlayers(data.players || []);
    setMaxRounds(data.maxRounds || 2);
    setRound(data.round || 0);
    setIsInLobby(true);
    router.push(`/multiplayer/${room_id}`);
  };

  const handleRoomCreate = async () => {
    const { data } = await axios.post(`/api/rooms/create`, {
      player: {
        _id: authState._id,
        name: authState.username,
        score: 0,
      },
    });
    setRoomId(data.room_code);
    setPlayers(data.players || []);
    setMaxRounds(data.maxRounds || 2);
    setRound(data.round || 0);
    setIsInLobby(true);
    router.push(`/multiplayer/${data.room_code}`);
  };

  let random: number;

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
        temporary_time = 12000;
        setTime(temporary_time);
        break;
      case 12000:
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

    if (timer !== 0) setIsTimerRunning(true);

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

    const response = axios.get(`/api/track/search/${query}`).then(res => {
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
    if (timerIntervalId !== null) clearInterval(timerIntervalId);
    setIsTimerRunning(false);
    setTimer(35.0);
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
        case 12000:
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
    if (!isTimerRunning) return;
    let localTimer = timer;
    if (timerIntervalId !== null) clearInterval(timerIntervalId); // Clear the previous interval
    const newIntervalId = setInterval(() => {
      if (localTimer <= 0) {
        clearInterval(newIntervalId);
        setTimer(35);
        if (submitRef.current) {
          submitRef.current.click();
        }
        setIsTimerRunning(false);
        return;
      }
      localTimer -= 0.1;
      setTimer(localTimer);
    }, 100);
    setTimerIntervalId(newIntervalId); // Set the new interval ID
  }, [isTimerRunning]);

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

  useEffect(() => {
    if (socket.connected && authState._id) socket.emit('id', authState._id);
  }, [authState._id]);

  const values = useMemo(
    () => ({
      players,
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
      handleRoomJoin,
      handleRoomCreate,
      isInLobby,
      roomId,
    }),
    [
      authState,
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
      isInLobby,
      roomId,
    ],
  );
  return <gameContext.Provider value={values}>{children}</gameContext.Provider>;
}

export default GameProvider;
