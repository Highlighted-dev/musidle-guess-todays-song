import React, {
  useState,
  createContext,
  useMemo,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react';
import { GameContextType, ISongs, player } from '@/@types/GameContext';
import axios from 'axios';
import useTimerStore from '@/stores/TimerStore';

import { useAuthStore } from '@/stores/AuthStore';
import { useRoomStore } from '@/stores/RoomStore';
import { useSocketStore } from '@/stores/SocketStore';
import { useAudioStore } from '@/stores/AudioStore';
import { usePhaseStore } from '@/stores/PhasesStore';
import { useAnswerStore } from '@/stores/AnswerStore';
export const gameContext = createContext<GameContextType | null>(null);

function GameProvider({ children }: { children: React.ReactNode }) {
  const { user_id } = useAuthStore();
  const { socket } = useSocketStore();
  const { currentPlayer, isInLobby, handleTurnChange, renderGame, setRenderGame } = useRoomStore();
  const { audio, setAudio, time, intervalId, setIntervalId } = useAudioStore();
  const { hasPhaseOneStarted, hasPhaseTwoStarted, hasPhaseThreeStarted } = usePhaseStore();
  const { answer, setAnswer, value, setValue, songs, setSongs, answerDialogOpen } =
    useAnswerStore();

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

  const handleAnswer = (answer: string) => {
    setAnswer(answer);
  };

  const handleRenderGame = () => {
    setRenderGame(!renderGame);
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

  useEffect(() => {
    if (!socket) return;
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
  }, [audio, socket]);

  useEffect(() => {
    if (!socket) return;
    socket.on('searchSong', songs => {
      setSongs(songs);
    });
    return () => {
      socket.off('searchSong');
    };
  }, [songs, socket]);

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
  }, [time, socket]);

  const values = useMemo(
    () => ({
      handleChooseCategory,
      searchSong,
      handleChooseArtist,
    }),
    [
      user_id,
      hasPhaseOneStarted,
      hasPhaseTwoStarted,
      hasPhaseThreeStarted,
      answer,
      renderGame,
      value,
      songs,
      isInLobby,
      socket,
      currentPlayer,
      answerDialogOpen,
      time,
    ],
  );
  return <gameContext.Provider value={values}>{children}</gameContext.Provider>;
}

export default GameProvider;
