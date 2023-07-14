import React, { useState, createContext, useMemo, useEffect, useContext, useRef } from 'react';
import { GameContextType, ISongs, player } from '@/@types/GameContext';
import { Socket, io } from 'socket.io-client';
import { authContext } from './AuthContext';
import { AuthContextType } from '@/@types/AuthContext';
import axios from 'axios';
import useTimerStore from '@/stores/TimerStore';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/AuthStore';
import { useRoomStore } from '@/stores/RoomStore';
import { useSocketStore } from '@/stores/SocketStore';
export const gameContext = createContext<GameContextType | null>(null);

function GameProvider({ children }: { children: React.ReactNode }) {
  const { user_id, username } = useAuthStore();
  const { socket } = useSocketStore();
  const {
    timer,
    setTimer,
    isTimerRunning,
    setIsTimerRunning,
    timerIntervalId,
    setTimerIntervalId,
  } = useTimerStore();
  const {
    players,
    setPlayers,
    setMaxRounds,
    maxRounds,
    round,
    setRound,
    joinRoom,
    room_code,
    createRoom,
  } = useRoomStore();
  const [currentPlayer, setCurrentPlayer] = useState<player | null>(null);
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

  const router = useRouter();

  const handleRoomJoin = async (room_id: string) => {
    if (!user_id) return;
    joinRoom(room_id).then(() => {
      router.push(`/multiplayer/${room_id}`);
    });
  };

  const handleRoomCreate = async () => {
    if (!user_id) return;
    createRoom().then(room_id => {
      console.log(room_id);
      router.push(`/multiplayer/${room_id}`);
    });
  };

  let random: number;

  const togglePhaseOne = () => {
    random = Math.floor(Math.random() * players.length);
    const current_player = players[random];
    socket?.emit('togglePhaseOne', current_player);
    if (!hasPhaseOneStarted) {
      setCurrentPlayer(current_player);
    }
    setHasPhaseOneStarted(!hasPhaseOneStarted);
  };

  const handleChooseCategory = (category: string) => {
    socket?.emit('chooseCategory', category);
    setAudio(new Audio(`/music/${category}.mp3`));
    handleAnswer('Payphone - Maroon 5');
    handleRenderGame();
  };

  const handleChooseArtist = (artist: string) => {
    socket?.emit('chooseArtist', artist);
    setAudio(new Audio(`/music/${artist}.mp3`));
    handleAnswer('Blinding Lights - The Weeknd');
    handleRenderGame();
  };

  const handleFinal = () => {
    socket?.emit('handleFinal');
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
    socket?.emit('skip', temporary_time);
  };

  const handleAudioTimeUpdate = () => {
    if (!audio) return;
    setAudioTime(audio.currentTime);
  };

  const handlePlay = () => {
    if (!audio) return;

    if (currentPlayer?._id == user_id) {
      socket?.emit('handlePlay');
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
    if (currentPlayer?._id == user_id) {
      socket?.emit('valueChange', value);
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
    if (currentPlayer?._id == user_id) {
      socket?.emit('searchSong', temp_songs.slice(0, 8));
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
    if (currentPlayer?._id == user_id) {
      socket?.emit('answerSubmit', points, currentPlayer);
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
    if (currentPlayer?._id == user_id) {
      socket?.emit('turnChange');
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
    if (!socket) return;
    socket.on('addPlayer', (player: player) => {
      if (players.find(p => p._id === player._id)) return;
      setPlayers([...players, player]);
    });
    if (!players.find(p => p._id === user_id)) return;
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
  }, [players, audio, time, socket]);

  useEffect(() => {
    if (!socket) return;
    socket.on('turnChange', () => {
      handleTurnChange();
    });
    return () => {
      socket.off('turnChange');
    };
  }, [currentPlayer]);

  useEffect(() => {
    if (!socket) return;
    socket.on('searchSong', songs => {
      setSongs(songs);
    });
    return () => {
      socket.off('searchSong');
    };
  }, [songs]);

  useEffect(() => {
    if (!socket) return;
    socket.on('valueChange', (value: string) => {
      handleValueChange(value);
    });
    return () => {
      socket.off('valueChange');
    };
  }, [value]);

  useEffect(() => {
    if (!socket) return;
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
    if (!socket) return;
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
    if (!socket) return;
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
      room_code,
      user_id,
      socket,
    }),
    [
      user_id,
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
      room_code,
      socket,
    ],
  );
  return <gameContext.Provider value={values}>{children}</gameContext.Provider>;
}

export default GameProvider;
