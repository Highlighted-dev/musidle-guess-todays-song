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
  setAnswer: (answer: string) =>
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
      label: 'Songs will appear here',
      key: 'no-song',
    },
  ],
  setSongs: (songs: ISongs[]) =>
    set(() => ({
      songs: songs,
    })),
  handleValueChange: (value: string) => {
    if (useRoomStore.getState().currentPlayer?._id == useAuthStore.getState().user_id) {
      useSocketStore.getState().socket?.emit('valueChange', value);
    }
    useAnswerStore.setState({ value: value });
  },
  answerDialogOpen: false,
  setAnswerDialogOpen: (answerDialogOpen: boolean) =>
    set(() => ({
      answerDialogOpen: answerDialogOpen,
    })),
  handleAnswerSubmit: () => {
    const current_player = useRoomStore.getState().currentPlayer;
    const user_id = useAuthStore.getState().user_id;
    const socket = useSocketStore.getState().socket;

    if (!current_player) return;
    useAnswerStore.setState({ answerDialogOpen: !useAnswerStore.getState().answerDialogOpen });
    if (useTimerStore.getState().timerIntervalId !== null)
      clearInterval(useTimerStore.getState().timerIntervalId!);
    useTimerStore.getState().setIsTimerRunning(false);
    useTimerStore.getState().setTimer(35.0);
    if (useAudioStore.getState().audio) useAudioStore.getState().audio?.pause();
    let points = 0;
    if (
      useAnswerStore.getState().value &&
      useAnswerStore.getState().value.toLowerCase() ==
        useAnswerStore.getState().answer.toLowerCase()
    ) {
      switch (useAudioStore.getState().time) {
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
    if (current_player?._id == user_id) {
      useRoomStore.getState().updatePlayerScore(points, current_player);
      socket?.emit('answerSubmit', points, current_player);
    }
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
          label: `${track.name} - ${track.artist}`,
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
      socket?.emit('searchSong', temp_songs.slice(0, 8));
    }
  },
}));
