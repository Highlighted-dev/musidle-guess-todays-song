'use client';
import { create } from 'zustand';
import { useRoomStore } from './RoomStore';
import { useSocketStore } from './SocketStore';
import { useTimerStore } from './TimerStore';
import { useAudioStore } from './AudioStore';
import { IAnswer, IAnswerStore, ILastFmSong, ISong } from '../@types/AnswerStore';
import { useNextAuthStore } from './NextAuthStore';
import { toast } from '../components/ui/use-toast';
import { IPlayerCategories } from '../@types/Categories';
import { getCurrentUrl } from '../utils/GetCurrentUrl';
import { Session } from 'next-auth';

export const useAnswerStore = create<IAnswerStore>(set => ({
  loadingAnswer: false,
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
  categories: [],
  handleValueChange: async (value: string, session: Session | null) => {
    if (
      useSocketStore.getState().socket &&
      useRoomStore.getState().currentPlayer?.id == session?.user?.id
    ) {
      useSocketStore
        .getState()
        .socket?.emit('valueChange', value, useRoomStore.getState().roomCode);
    }
    useAnswerStore.setState({ value: value });
  },
  handleAnswerSubmit: async (router = null) => {
    // if router is not null, it means that the user is playing daily mode
    const { currentPlayer, roomCode, handleTurnChange, setTurnChangeDialogOpen } =
      useRoomStore.getState();
    const session = useNextAuthStore.getState().session;
    const socket = useSocketStore.getState().socket;
    const { setValue, setAnswer, setPossibleAnswers } = useAnswerStore.getState();
    let category = '';
    if (!currentPlayer && !router) return;
    useAnswerStore.setState({ loadingAnswer: true });
    if (
      useRoomStore.getState().round <= useRoomStore.getState().maxRoundsPhaseOne &&
      currentPlayer?.id == session?.user?.id
    ) {
      useRoomStore.getState().players.map(player => {
        if (player.id == session?.user?.id) {
          player.completedCategories.map((item: IPlayerCategories) => {
            if (useAudioStore.getState().songId.includes(item.category)) {
              category = item.category;
              item.completed = true;
            }
          });
        }
      });
    }
    if (currentPlayer?.id == session?.user?.id || router) {
      await fetch(getCurrentUrl() + `/externalApi/rooms/checkAnswer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomCode: useRoomStore.getState().roomCode,
          playerId: currentPlayer?.id ? currentPlayer.id : session?.user?.id,
          playerAnswer: useAnswerStore.getState().value,
          songId: useAudioStore.getState().songId,
          time: useAudioStore.getState().time,
          category,
        }),
      })
        .then(res => res.json())
        .then(res => {
          useAnswerStore.getState().setAnswer(res.answer || null);
          if (useSocketStore.getState().socket && currentPlayer) {
            useRoomStore.getState().updatePlayerScore(res.score, currentPlayer);
            socket?.emit('answerSubmit', res.score, currentPlayer, res.answer, roomCode);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
    const { audio, audioContext, setAudioTime } = useAudioStore.getState();

    if (audioContext!.currentTime > 10) {
      if (audio) {
        const newAudioContext = new AudioContext();
        audio.stop();
        const gainNode = newAudioContext.createGain();
        gainNode.gain.value = 0.1;
        gainNode.connect(newAudioContext.destination);

        const newAudio = newAudioContext!.createBufferSource();
        newAudio.buffer = audio.buffer;
        newAudio.connect(gainNode);

        newAudio.start();
        newAudioContext.suspend();
        useAudioStore.setState({
          audio: newAudio,
          audioContext: newAudioContext,
        });
      }
    }
    if (useAudioStore.getState().audioContext?.state === 'suspended')
      useAudioStore.getState().audioContext?.resume();
    useAudioStore.getState().setTime(12000);

    useTimerStore.getState().setTimer(useTimerStore.getState().maxTimer);
    // if (audio) audio.volume = 0.05;
    useAnswerStore.setState({ loadingAnswer: false });
    if (currentPlayer && currentPlayer.id === session?.user?.id) handleTurnChange();
    else if (router) {
      // Set cookie that ends on 00:00:00 the next day
      const expires = new Date();
      expires.setHours(24, 0, 0, 0);
      document.cookie =
        'playedDaily=' + encodeURIComponent(true) + '; expires=' + expires + '; path=/';
      setTurnChangeDialogOpen(true);
      setTimeout(() => {
        setTurnChangeDialogOpen(false);
        useAudioStore.getState().setTime(1000);
        setValue('');
        setAnswer('');
        setPossibleAnswers([
          {
            value: 'Songs will appear here',
            key: 'no-song',
          },
        ]);
        useAudioStore.getState().audioContext?.suspend();
        router.refresh();
      }, 4000);
    }
  },
  getPossibleSongAnswers: async (query: string) => {
    if (query.length < 1) return;

    const response = await fetch(getCurrentUrl() + `/externalApi/track/search/${query}`)
      .then(res => res.json())
      .then(data => {
        return data;
      })
      .catch(err => {
        console.log(err);
      });

    const data = await response;
    const tempSongs: IAnswer[] = [];
    if (data.length > 0) {
      data.map((track: ILastFmSong) => {
        // Check if the song is already in the songs state
        if (tempSongs.find(song => song.key === track.url)) return;
        tempSongs.push({
          value: `${track.artist} - ${track.name}`,
          key: track.url,
        });
      });
      const { round, maxRoundsPhaseOne, maxRoundsPhaseTwo } = useRoomStore.getState();
      useAnswerStore.setState({
        possibleAnswers: tempSongs.slice(
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
    if (currentPlayer?.id == session?.user?.id) {
      socket?.emit(
        'searchSong',
        useAnswerStore.getState().possibleAnswers,
        useRoomStore.getState().roomCode,
      );
    }
  },
  revealArtist: async (songId: string) => {
    const possibleSongs = useAnswerStore.getState().possibleSongs;
    const song = possibleSongs.find(song => song.songId === songId);
    if (!song) {
      return toast({
        variant: 'destructive',
        title: 'Error',
        description: `Song for song id ${songId} not found, cannot reveal artist`,
        style: { whiteSpace: 'pre-line' },
      });
    }
    useAnswerStore.getState().setArtist(song.artist || '');
  },
  changeSongToCompleted: (songId: string) => {
    //Change "completed" boolean in possibleSongs for song with song_id to true
    const possibleSongs = useAnswerStore.getState().possibleSongs;

    possibleSongs.map((song: { songId: string; completed: boolean }) => {
      if (song.songId == songId) {
        song.completed = true;
      }
    });

    useAnswerStore.getState().setPossibleSongs(possibleSongs);
  },
}));
