'use client';
import axios from 'axios';
import { create } from 'zustand';
import { IRoomStore, IPlayer } from '../@types/Rooms';
import { useSocketStore } from './SocketStore';
import { io } from 'socket.io-client';
import { useAnswerStore } from './AnswerStore';
import { useAudioStore } from './AudioStore';
import { toast } from '../components/ui/use-toast';
import { useTimerStore } from './TimerStore';
import { Router } from 'next/router';
import { useRouter } from 'next/navigation';
import dotenv from 'dotenv';
import { useRef } from 'react';
import { ICategory } from '../@types/Categories';
import { Session } from 'next-auth';
dotenv.config();

export const useRoomStore = create<IRoomStore>(set => ({
  roomCode: '',
  setRoomCode: (roomCode: string) =>
    set(() => ({
      roomCode: roomCode,
    })),
  players: [],
  setPlayers: (players: IPlayer[]) =>
    set(() => ({
      players: players,
    })),
  spectators: [],
  setSpectators: (spectators: IPlayer[]) =>
    set(() => ({
      spectators: spectators,
    })),
  round: 1,
  stage: 1,
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
  selectMode: false,
  setSelectMode: (selectMode: boolean) =>
    set(() => ({
      selectMode: selectMode,
    })),
  turnChangeDialogOpen: false,
  setTurnChangeDialogOpen: (turnChangeDialogOpen: boolean) =>
    set(() => ({
      turnChangeDialogOpen: turnChangeDialogOpen,
    })),
  random: 0,
  leaveRoom: async (router: Router, userId = null) => {
    const { roomCode } = useRoomStore.getState();
    if (userId) {
      await fetch(`/externalApi/rooms/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomCode: roomCode,
          playerId: userId,
        }),
      })
        .then(async res => {
          if (res.status === 200) {
            const data = await res.json();
            toast({
              title: 'Success!',
              description: data.message,
            });
            useSocketStore.getState().socket?.disconnect();
            useSocketStore.setState({ socket: null });
            router.push('/games/multiplayer');
            useRoomStore.setState({
              roomCode: '',
              players: [],
              currentPlayer: null,
              maxRoundsPhaseOne: 2,
              maxRoundsPhaseTwo: 2,
              round: 1,
              isInLobby: false,
              selectMode: false,
            });
          }
        })
        .catch(err => {
          console.log(err);
        });

      return;
    }
  },
  updatePlayerScore: (points, player) => {
    const tempPlayers = useRoomStore.getState().players.map(p => {
      if (p.id === player.id) {
        p.score += points;
      }
      return p;
    });
    useRoomStore.setState({ players: tempPlayers });
  },
  handleTurnChange: async () => {
    if (!useRoomStore.getState().currentPlayer) return;
    const socket = useSocketStore.getState().socket;
    if (socket) {
      socket.emit('turnChange', useRoomStore.getState().roomCode, useAudioStore.getState().songId);
    }
  },
  handleChooseCategory: async (songId, phase = 1, socket = null) => {
    if (!socket) socket = useSocketStore.getState().socket;
    const { roomCode } = useRoomStore.getState();
    if (socket && roomCode) {
      useAudioStore.setState({ audioContext: null });
      socket?.emit('chooseSong', songId, roomCode, phase);
    }
  },
  votesForTurnSkip: 0,
}));

// Alright so if you are reading this you are probably wondering what the hell is going on below.
// Well, this initializer is used to initialize the room store with the data that is passed from the server.
// Key word - server. As I dont want to expose the data about the room that is passed from the server to the client, I've choosen the initializer approach.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function RoomStoreInitializer({
  data,
  buffer,
  session,
}: {
  data: any;
  buffer: any;
  session: Session | null;
}) {
  const initialized = useRef(false);
  const roomData = data;
  useSocketStore.getState().router = useRouter();
  if (buffer != null) {
    try {
      const arrayBuffer = Uint8Array.from(Buffer.from(buffer, 'base64')).buffer;
      // Use the audio data to create an AudioContext and decode the audio data
      const audioContext = new AudioContext();
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 0.1;
      gainNode.connect(audioContext.destination);
      audioContext
        .decodeAudioData(arrayBuffer, audioBuffer => {
          const source = audioContext.createBufferSource();
          source.buffer = audioBuffer;

          source.connect(gainNode);
          source.start();
          audioContext.suspend();
          useAudioStore.setState({
            audio: source,
            audioContext: audioContext,
          });
        })
        .catch(err => console.log(err));
    } catch (err) {
      console.log(err);
    }
  }
  if (!initialized.current) {
    initialized.current = true;
    useRoomStore.setState({
      roomCode: roomData.roomCode,
      players: roomData.players,
      spectators: roomData.spectators,
      currentPlayer: roomData.currentPlayer,
      maxRoundsPhaseOne: roomData.maxRoundsPhaseOne,
      maxRoundsPhaseTwo: roomData.maxRoundsPhaseTwo,
      round: roomData.round,
      stage: roomData.stage,
      isInLobby: roomData.isInGameLobby,
      selectMode: !roomData.isInSelectMode,
      votesForTurnSkip: roomData.votesForTurnSkip,
    });
    useTimerStore.setState({ timer: roomData.timer });
    useTimerStore.setState({ maxTimer: roomData.maxTimer });
    useAnswerStore.setState({ possibleSongs: roomData.songs });
    // Get all categories that aren't equal to 'final' and 'artists
    const categories = [...new Set(roomData.songs.map((item: ICategory) => item.category))].filter(
      category => category != 'final' && category != 'artists',
    );

    useAnswerStore.setState({
      categories: categories,
    });
    useAudioStore.setState({
      songId: roomData.songId,
      time: {
        1: 1000,
        2: 3000,
        3: 6000,
        4: 12000,
        default: 1000,
      }[roomData.stage * 1],
    });
    const audio = useAudioStore.getState().audio;
    // if (audio) {
    //   audio.volume = useAudioStore.getState().volume;
    // }
    if (!useSocketStore.getState().socket) {
      useSocketStore
        .getState()
        .setSocket(
          io(
            process.env.NODE_ENV == 'production'
              ? process.env.NEXT_PUBLIC_API_HOST ?? 'http://localhost:5000'
              : 'http://localhost:5000',
          ),
        );
      useSocketStore.getState().socket?.emit('id', session?.user.id, roomData.roomCode);
    }
  }
  return null;
}
