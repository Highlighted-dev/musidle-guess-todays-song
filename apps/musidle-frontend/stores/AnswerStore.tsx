import { create } from 'zustand';
import { useRoomStore } from './RoomStore';
import { useSocketStore } from './SocketStore';
import { useTimerStore } from '@/stores/TimerStore';
import { useAudioStore } from './AudioStore';
import axios from 'axios';
import { IAnswer, IAnswerStore, ISong } from '@/@types/AnswerStore';
import { useNextAuthStore } from '@/stores/NextAuthStore';
import { toast } from '@/components/ui/use-toast';

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
  artist: '',
  setArtist: (artist: string) =>
    set(() => ({
      artist: artist,
    })),
  possibleAnswers: [
    {
      value: 'Songs will appear here',
      key: 'no-song',
    },
  ],
  setPossibleAnswers: (possibleAnswers: IAnswer[]) =>
    set(() => ({
      possibleAnswers: possibleAnswers,
    })),
  possibleSongs: [],
  setPossibleSongs: (possibleSongs: ISong[]) =>
    set(() => ({
      possibleSongs: possibleSongs,
    })),
  handleValueChange: async (value: string) => {
    const session = useNextAuthStore.getState().session;
    if (useRoomStore.getState().currentPlayer?._id == session?.user?._id) {
      useSocketStore
        .getState()
        .socket?.emit('valueChange', value, useRoomStore.getState().room_code);
    }
    useAnswerStore.setState({ value: value });
  },
  handleAnswerSubmit: async () => {
    const { currentPlayer, room_code, handleTurnChange } = useRoomStore.getState();
    const session = useNextAuthStore.getState().session;
    const socket = useSocketStore.getState().socket;
    let category = '';
    //set completedCategories.category.completed to true
    if (
      useRoomStore.getState().round <= useRoomStore.getState().maxRoundsPhaseOne &&
      currentPlayer?._id == session?.user?._id
    ) {
      useRoomStore.getState().players.map(player => {
        if (player._id == session?.user?._id) {
          player.completedCategories.map((item: any) => {
            if (useAudioStore.getState().songId.includes(item.category)) {
              category = item.category;
              item.completed = true;
            }
          });
        }
      });
    }
    if (currentPlayer?._id == session?.user?._id) {
      await axios
        .post(`/externalApi/rooms/checkAnswer`, {
          room_code: useRoomStore.getState().room_code,
          player_id: currentPlayer._id,
          player_answer: useAnswerStore.getState().value,
          song_id: useAudioStore.getState().songId,
          time: useAudioStore.getState().time,
          category: category,
        })
        .then(res => res.data)
        .then(res => {
          useAnswerStore.getState().setAnswer(res.answer || null);
          useRoomStore.getState().updatePlayerScore(res.score, currentPlayer);
          socket?.emit('answerSubmit', res.score, currentPlayer, res.answer, room_code);
        });
    }
    if (useAudioStore.getState().audio?.paused) useAudioStore.getState().audio?.play();
    useAudioStore.getState().setTime(12000);
    const audio = useAudioStore.getState().audio;
    useTimerStore.getState().setTimer(useTimerStore.getState().maxTimer);
    if (audio) audio.volume = 0.05;
    if (currentPlayer && currentPlayer._id === session?.user?._id) handleTurnChange();
  },
  getPossibleSongAnswers: async (query: string) => {
    if (query.length < 1) return;

    const response = axios.get(`/externalApi/track/search/${query}`).then(res => {
      return res.data;
    });

    const data = await response;
    const temp_songs: IAnswer[] = [];
    if (data.length > 0) {
      data.map((track: any) => {
        // Check if the song is already in the songs state
        if (temp_songs.find(song => song.key === track.url)) return;
        temp_songs.push({
          value: `${track.artist} - ${track.name}`,
          key: track.url,
        });
      });
      const { round, maxRoundsPhaseOne, maxRoundsPhaseTwo } = useRoomStore.getState();
      useAnswerStore.setState({
        possibleAnswers: temp_songs.slice(
          0,
          round > maxRoundsPhaseOne && round <= maxRoundsPhaseOne + maxRoundsPhaseTwo
            ? 2
            : round > maxRoundsPhaseOne + maxRoundsPhaseTwo
            ? 1
            : 8,
        ),
      }); // Update the songs state with the new search results
    } else {
      useAnswerStore.setState({ possibleAnswers: [] }); // Clear the songs state if there are no search results
    }

    const { currentPlayer } = useRoomStore.getState();
    const { socket } = useSocketStore.getState();
    const session = useNextAuthStore.getState().session;
    if (currentPlayer?._id == session?.user?._id) {
      socket?.emit(
        'searchSong',
        useAnswerStore.getState().possibleAnswers,
        useRoomStore.getState().room_code,
      );
    }
  },
  revealArtist: async (song_id: string) => {
    const possibleSongs = useAnswerStore.getState().possibleSongs;
    const song = possibleSongs.find(song => song.song_id === song_id);
    if (!song) {
      return toast({
        variant: 'destructive',
        title: 'Error',
        description: `Song for song_id ${song_id} not found, cannot reveal artist`,
        style: { whiteSpace: 'pre-line' },
      });
    }
    useAnswerStore.getState().setArtist(song.artist || '');
  },
  changeSongToCompleted: (song_id: string) => {
    //Change "completed" boolean in possibleSongs for song with song_id to true
    const possibleSongs = useAnswerStore.getState().possibleSongs;

    possibleSongs.map((song: { song_id: string; completed: boolean }) => {
      if (song.song_id == song_id) {
        song.completed = true;
      }
    });

    useAnswerStore.getState().setPossibleSongs(possibleSongs);
  },
}));
