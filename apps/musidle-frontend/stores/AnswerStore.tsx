import { create } from 'zustand';
import { useRoomStore } from './RoomStore';
import { useAuthStore } from './AuthStore';
import { useSocketStore } from './SocketStore';
import useTimerStore from './TimerStore';
import { useAudioStore } from './AudioStore';
import axios from 'axios';
import { IAnswerStore, ISongs } from '@/@types/AnswerStore';

export const useAnswerStore = create<IAnswerStore>(set => ({
  answer: '',
  setAnswer: (answer: string | null) =>
    set(() => ({
      answer: answer,
    })),
  value: '',
  setValue: (value: string) =>
    set(() => ({
      value: value,
    })),
  songs: [
    {
      value: 'Songs will appear here',
      key: 'no-song',
    },
  ],
  setSongs: (songs: ISongs[]) =>
    set(() => ({
      songs: songs,
    })),
  handleValueChange: (value: string) => {
    if (useRoomStore.getState().currentPlayer?._id == useAuthStore.getState().user_id) {
      useSocketStore
        .getState()
        .socket?.emit('valueChange', value, useRoomStore.getState().room_code);
    }
    useAnswerStore.setState({ value: value });
  },
  handleAnswerSubmit: async () => {
    const { currentPlayer, room_code, handleTurnChange } = useRoomStore.getState();
    const user_id = useAuthStore.getState().user_id;
    const socket = useSocketStore.getState().socket;

    if (currentPlayer?._id == user_id) {
      await axios
        .post(`/api/rooms/checkAnswer`, {
          room_code: useRoomStore.getState().room_code,
          player_id: currentPlayer._id,
          player_answer: useAnswerStore.getState().value,
          song_id: useAudioStore.getState().songId,
          time: useAudioStore.getState().time,
        })
        .then(res => res.data)
        .then(res => {
          useAnswerStore.setState({ answer: res.data.answer || null });
          useRoomStore.getState().updatePlayerScore(res.data.score, currentPlayer);
          socket?.emit('answerSubmit', res.data.score, currentPlayer, res.data.answer, room_code);
        });
    }
    if (useTimerStore.getState().timerIntervalId !== null)
      clearInterval(useTimerStore.getState().timerIntervalId!);
    useTimerStore.getState().setIsTimerRunning(false);
    useTimerStore.getState().setTimer(35.0);
    if (useAudioStore.getState().audio) useAudioStore.getState().audio?.pause();
    handleTurnChange();
  },
  getPossibleSongAnswers: async (query: string) => {
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
          key: track.url,
        });
      });
      useAnswerStore.setState({ songs: temp_songs.slice(0, 8) }); // Update the songs state with the new search results
    } else {
      useAnswerStore.setState({ songs: [] }); // Clear the songs state if there are no search results
    }

    const { currentPlayer } = useRoomStore.getState();
    const { socket } = useSocketStore.getState();
    const { user_id } = useAuthStore.getState();
    if (currentPlayer?._id == user_id) {
      socket?.emit(
        'searchSong',
        useAnswerStore.getState().songs,
        useRoomStore.getState().room_code,
      );
    }
  },
}));
