import axios from 'axios';
import { create } from 'zustand';
import { useAuthStore } from './AuthStore';
import { IRoomStore, IPlayer } from '@/@types/Rooms';
import { useSocketStore } from './SocketStore';
import { io } from 'socket.io-client';
import { useAnswerStore } from './AnswerStore';
import { useAudioStore } from './AudioStore';
import { usePhaseStore } from './PhasesStore';
import { toast } from '@/components/ui/use-toast';

export const useRoomStore = create<IRoomStore>(set => ({
  room_code: '',
  setRoomCode: (room_code: string) =>
    set(() => ({
      room_code: room_code,
    })),
  players: [],
  setPlayers: (players: IPlayer[]) =>
    set(() => ({
      players: players,
    })),
  round: 1,
  setRound: (round: number) =>
    set(() => ({
      round: round,
    })),
  maxRoundsPhaseOne: 2,
  setMaxRoundsPhaseOne: (maxRoundsPhaseOne: number) =>
    set(() => ({
      maxRoundsPhaseOne: maxRoundsPhaseOne,
    })),
  maxRoundsPhaseTwo: 2,
  setMaxRoundsPhaseTwo: (maxRoundsPhaseTwo: number) =>
    set(() => ({
      maxRoundsPhaseTwo: maxRoundsPhaseTwo,
    })),

  isInLobby: false,
  setIsInLobby: (isInLobby: boolean) =>
    set(() => ({
      isInLobby: isInLobby,
    })),
  currentPlayer: null,
  setCurrentPlayer: (player: IPlayer) =>
    set(() => ({
      currentPlayer: player,
    })),
  renderGame: false,
  setRenderGame: (renderGame: boolean) =>
    set(() => ({
      renderGame: renderGame,
    })),
  joinRoom: async (room_code: string) => {
    if (useAuthStore.getState().user_id) {
      const { data } = await axios.post(`/api/rooms/join`, {
        room_id: room_code,
        player: {
          _id: useAuthStore.getState().user_id,
          name: useAuthStore.getState().username,
          score: 0,
        },
      });
      set(() => ({
        room_code: room_code,
        players: data.players,
        maxRoundsPhaseOne: data.maxRoundsPhaseOne,
        maxRoundsPhaseTwo: data.maxRoundsPhaseTwo,
        round: data.round,
        isInLobby: true,
      }));
      //set socket the to the room
      useSocketStore
        .getState()
        .setSocket(
          io(
            process.env.NODE_ENV == 'production'
              ? process.env.NEXT_PUBLIC_API_HOST ?? 'http://localhost:5000'
              : 'http://localhost:5000',
          ),
        );
      useSocketStore.getState().socket?.emit('id', useAuthStore.getState().user_id, room_code);
      return;
      // router.push(`/multiplayer/${room_id}`);
    }
  },
  createRoom: async () => {
    if (useAuthStore.getState().user_id) {
      const { data } = await axios.post(`/api/rooms/create`, {
        player: {
          _id: useAuthStore.getState().user_id,
          name: useAuthStore.getState().username,
          score: 0,
        },
      });
      set(() => ({
        room_code: data.room_code,
        players: data.players,
        maxRoundsPhaseOne: data.maxRoundsPhaseOne,
        maxRoundsPhaseTwo: data.maxRoundsPhaseTwo,
        round: data.round,
        isInLobby: true,
      }));
      useSocketStore
        .getState()
        .setSocket(
          io(
            process.env.NODE_ENV == 'production'
              ? process.env.NEXT_PUBLIC_API_HOST ?? 'http://localhost:5000'
              : 'http://localhost:5000',
          ),
        );
      useSocketStore.getState().socket?.emit('id', useAuthStore.getState().user_id, data.room_code);
      return data.room_code;
      // router.push(`/multiplayer/${room_id}`);
    }
  },
  updatePlayerScore: (points: number, player: IPlayer) => {
    const temp_players = useRoomStore.getState().players.map(p => {
      if (p._id === player._id) {
        p.score += points;
      }
      return p;
    });
    useRoomStore.setState({ players: temp_players });
  },
  handleTurnChange: () => {
    const {
      players,
      currentPlayer,
      round,
      maxRoundsPhaseOne,
      maxRoundsPhaseTwo,
      setRound,
      setCurrentPlayer,
      setRenderGame,
    } = useRoomStore.getState();
    const { socket } = useSocketStore.getState();
    const { setAnswerDialogOpen, setValue, setAnswer, setSongs } = useAnswerStore.getState();
    const { setAudioTime, setAudio, setTime, intervalId } = useAudioStore.getState();
    const { user_id } = useAuthStore.getState();
    const {
      hasPhaseOneStarted,
      hasPhaseTwoStarted,
      setHasPhaseOneStarted,
      setHasPhaseTwoStarted,
      setHasPhaseThreeStarted,
      handleFinal,
    } = usePhaseStore.getState();
    if (!currentPlayer) return;
    if (currentPlayer?._id == user_id) {
      socket?.emit('turnChange', useRoomStore.getState().room_code);
    }
    const index = players.findIndex(p => p._id === currentPlayer._id);
    if (index === players.length - 1) {
      setCurrentPlayer(players[0]);
    } else {
      setCurrentPlayer(players[index + 1]);
    }
    if (intervalId !== null) clearInterval(intervalId);
    setAnswerDialogOpen(false);
    setAudioTime(0);
    setAudio(null);
    setValue('');
    setAnswer('');
    setTime(1000);
    setSongs([
      {
        value: 'Songs will appear here',
        key: 'no-song',
      },
    ]);
    setRenderGame(false);
    if (maxRoundsPhaseOne === round && hasPhaseOneStarted) {
      setHasPhaseTwoStarted(true);
      setHasPhaseOneStarted(false);
      setRound(1);
      return;
    } else if (maxRoundsPhaseTwo === round && hasPhaseTwoStarted) {
      handleFinal();
      setHasPhaseTwoStarted(false);
      setHasPhaseThreeStarted(true);
      setRound(1);
      return;
    }
    setRound(round + 1);
  },
  handleChooseCategory: (category: string, phase = 1) => {
    const { socket } = useSocketStore.getState();
    const { setAudio, setSongId } = useAudioStore.getState();
    const { setRenderGame, renderGame, room_code } = useRoomStore.getState();
    if (phase === 1) {
      socket?.emit('chooseCategory', category, room_code);
      setSongId(category);
    } else if (phase === 2) {
      socket?.emit('chooseArtist', category, room_code);
      setSongId(category);
    }
    setAudio(new Audio(`/music/${category}.mp3`));
    setRenderGame(!renderGame);
  },
  async updateSettings(maxRoundsPhaseOne: number, maxRoundsPhaseTwo: number) {
    if (maxRoundsPhaseOne < 1 || maxRoundsPhaseTwo < 1) return;
    if (maxRoundsPhaseOne > 400 || maxRoundsPhaseTwo > 200) return;

    //if either of maxRounds is NaN, then use the current value
    const mxRoundsPhaseOne = isNaN(maxRoundsPhaseOne)
      ? useRoomStore.getState().maxRoundsPhaseOne
      : maxRoundsPhaseOne;
    const mxRoundsPhaseTwo = isNaN(maxRoundsPhaseTwo)
      ? useRoomStore.getState().maxRoundsPhaseTwo
      : maxRoundsPhaseTwo;

    await axios
      .put(`/api/rooms/settings`, {
        room_code: useRoomStore.getState().room_code,
        maxRoundsPhaseOne: mxRoundsPhaseOne,
        maxRoundsPhaseTwo: mxRoundsPhaseTwo,
      })
      .then(res => {
        if (res.status === 200) {
          toast({
            variant: 'default',
            title: 'Success!',
            description: res.data.message,
          });
        }
      });
  },
}));
