import { useAudioStore } from '@/stores/AudioStore';
import { useRoomStore } from '@/stores/RoomStore';
import { useSocketStore } from '@/stores/SocketStore';
import { useAuthStore } from '@/stores/AuthStore';
import axios from 'axios';
import { io } from 'socket.io-client';

describe('RoomStore', () => {
  const socket = io(
    process.env.NODE_ENV == 'production'
      ? process.env.NEXT_PUBLIC_API_HOST ?? 'http://localhost:5000'
      : 'http://localhost:5000',
  );

  beforeEach(() => {
    // Reset the store state
    useRoomStore.setState({
      room_code: '',
      players: [],
      spectators: [],
      currentPlayer: null,
      maxRoundsPhaseOne: 2,
      maxRoundsPhaseTwo: 2,
      round: 1,
      isInLobby: false,
      selectMode: false,
    });
  });
  describe('createRoom', () => {
    it('should create a room and set the state correctly', async () => {
      // Mock the axios.post method to return some data
      jest.spyOn(axios, 'post').mockResolvedValueOnce({
        data: {
          room_code: 'TEST123',
          players: [{ _id: '652010b7df0c54954ccf2a5a', name: 'Test123@gmail.com', score: 0 }],
          spectators: [],
          current_player: { _id: '652010b7df0c54954ccf2a5a', name: 'Test123@gmail.com', score: 0 },
          maxRoundsPhaseOne: 2,
          maxRoundsPhaseTwo: 2,
          round: 1,
          isInGameLobby: true,
          isInSelectMode: false,
          songs: [],
        },
      });

      // Call the createRoom function
      await useRoomStore.getState().createRoom('652010b7df0c54954ccf2a5a', 'Test123@gmail.com');

      // Check that the state is set correctly
      expect(useRoomStore.getState().room_code).toEqual('TEST123');
      expect(useRoomStore.getState().players).toEqual([
        { _id: '652010b7df0c54954ccf2a5a', name: 'Test123@gmail.com', score: 0 },
      ]);
      expect(useRoomStore.getState().spectators).toEqual([]);
      expect(useRoomStore.getState().currentPlayer).toEqual({
        _id: '652010b7df0c54954ccf2a5a',
        name: 'Test123@gmail.com',
        score: 0,
      });
      expect(useRoomStore.getState().maxRoundsPhaseOne).toEqual(2);
      expect(useRoomStore.getState().maxRoundsPhaseTwo).toEqual(2);
      expect(useRoomStore.getState().round).toEqual(1);
      expect(useRoomStore.getState().isInLobby).toEqual(true);
      expect(useRoomStore.getState().selectMode).toEqual(true);
    });
  });

  describe('joinRoom', () => {
    it('should join the room and set the state correctly', async () => {
      // Mock the axios.post method to return some data

      jest.spyOn(axios, 'post').mockResolvedValueOnce({
        data: {
          players: [{ _id: '652010b7df0c54954ccf2a5a', name: 'Test123@gmail.com', score: 0 }],
          spectators: [],
          current_player: { _id: '652010b7df0c54954ccf2a5a', name: 'Test123@gmail.com', score: 0 },
          maxRoundsPhaseOne: 2,
          maxRoundsPhaseTwo: 2,
          round: 1,
          isInGameLobby: true,
          isInSelectMode: false,
          songs: [],
          song_id: '',
          timer: 0,
        },
      });

      // Call the joinRoom function
      await useRoomStore
        .getState()
        .joinRoom('TEST123', '652010b7df0c54954ccf2a5a', 'Test123@gmail.com');

      // Check that the state is set correctly
      expect(useRoomStore.getState().room_code).toEqual('TEST123');
      expect(useRoomStore.getState().players).toEqual([
        { _id: '652010b7df0c54954ccf2a5a', name: 'Test123@gmail.com', score: 0 },
      ]);
      expect(useRoomStore.getState().spectators).toEqual([]);
      expect(useRoomStore.getState().currentPlayer).toEqual({
        _id: '652010b7df0c54954ccf2a5a',
        name: 'Test123@gmail.com',
        score: 0,
      });
      expect(useRoomStore.getState().maxRoundsPhaseOne).toEqual(2);
      expect(useRoomStore.getState().maxRoundsPhaseTwo).toEqual(2);
      expect(useRoomStore.getState().round).toEqual(1);
      expect(useRoomStore.getState().isInLobby).toEqual(true);
      expect(useRoomStore.getState().selectMode).toEqual(true);
    });
  });

  describe('leaveRoom', () => {
    it('should leave the room and set the state correctly', async () => {
      // Set the initial state
      useRoomStore.setState({
        room_code: 'room_code',
        players: [{ _id: '652010b7df0c54954ccf2a5a', name: 'Test123@gmail.com', score: 0 }],
        currentPlayer: { _id: '652010b7df0c54954ccf2a5a', name: 'Test123@gmail.com', score: 0 },
        maxRoundsPhaseOne: 2,
        maxRoundsPhaseTwo: 2,
        round: 1,
        isInLobby: true,
        selectMode: false,
      });

      // Mock the axios.post method to return some data
      jest.spyOn(axios, 'post').mockResolvedValueOnce({});

      // Call the leaveRoom function
      await useRoomStore.getState().leaveRoom({ push: jest.fn() }, '652010b7df0c54954ccf2a5a');

      // Check that the state is set correctly
      expect(useRoomStore.getState().room_code).toEqual('');
      expect(useRoomStore.getState().players).toEqual([]);
      expect(useRoomStore.getState().currentPlayer).toEqual(null);
      expect(useRoomStore.getState().maxRoundsPhaseOne).toEqual(2);
      expect(useRoomStore.getState().maxRoundsPhaseTwo).toEqual(2);
      expect(useRoomStore.getState().round).toEqual(1);
      expect(useRoomStore.getState().isInLobby).toEqual(false);
      expect(useRoomStore.getState().selectMode).toEqual(false);
    });
  });

  describe('startGame', () => {
    it('should start the game and set the state correctly', () => {
      // Set the initial state
      useRoomStore.setState({
        players: [
          { _id: '652010b7df0c54954ccf2a5a', name: 'Test123@gmail.com', score: 0 },
          { _id: '2', name: 'Player 2', score: 0 },
        ],
        isInLobby: true,
      });

      // Mock the useSocketStore.getState().socket.emit method
      const emitMock = jest.fn();
      jest.spyOn(socket, 'emit').mockImplementationOnce(emitMock);

      // Call the startGame function
      useRoomStore.getState().startGame(socket);

      // Check that the state is set correctly
      expect(useRoomStore.getState().isInLobby).toEqual(false);
      expect(useRoomStore.getState().currentPlayer).toBeDefined();
      expect(emitMock).toHaveBeenCalled();
    });
  });

  describe('updatePlayerScore', () => {
    it('should update the player score and set the state correctly', () => {
      // Set the initial state
      useRoomStore.setState({
        players: [
          { _id: '652010b7df0c54954ccf2a5a', name: 'Test123@gmail.com', score: 0 },
          { _id: '2', name: 'Player 2', score: 0 },
        ],
      });

      // Call the updatePlayerScore function
      useRoomStore.getState().updatePlayerScore(400, {
        _id: '652010b7df0c54954ccf2a5a',
        name: 'Test123@gmail.com',
        score: 0,
      });

      // Check that the state is set correctly
      expect(useRoomStore.getState().players).toEqual([
        { _id: '652010b7df0c54954ccf2a5a', name: 'Test123@gmail.com', score: 400 },
        { _id: '2', name: 'Player 2', score: 0 },
      ]);
    });
  });

  describe('handleTurnChange', () => {
    it('should handle the turn change and set the state correctly', () => {
      // Set the initial state
      useRoomStore.setState({
        players: [
          { _id: '652010b7df0c54954ccf2a5a', name: 'Test123@gmail.com', score: 0 },
          { _id: '2', name: 'Player 2', score: 0 },
        ],
        currentPlayer: { _id: '652010b7df0c54954ccf2a5a', name: 'Test123@gmail.com', score: 0 },
        round: 1,
        maxRoundsPhaseOne: 2,
        maxRoundsPhaseTwo: 2,
      });

      // Call the handleTurnChange function
      useRoomStore.getState().handleTurnChange();

      // Check that the state is set correctly
      expect(useRoomStore.getState().currentPlayer).toEqual({
        _id: '2',
        name: 'Player 2',
        score: 0,
      });
      expect(useRoomStore.getState().round).toEqual(2);
    });
  });

  describe('handleChooseCategory', () => {
    it('should handle the choose category and set the state correctly for phase 1', async () => {
      // Set the initial state
      useRoomStore.setState({
        room_code: 'TEST123',
        selectMode: false,
      });

      // Mock the axios.post method to return some data
      jest.spyOn(axios, 'post').mockResolvedValueOnce({
        data: {
          data: {
            song_id: 'song_id',
          },
        },
      });

      // Mock the useSocketStore.getState().socket.emit method
      const emitMock = jest.fn();
      jest.spyOn(socket, 'emit').mockImplementationOnce(emitMock);

      // Call the handleChooseCategory function
      const song_id = await useRoomStore.getState().handleChooseCategory('song_id', 1, socket);

      // Check that the state is set correctly
      expect(useRoomStore.getState().selectMode).toEqual(true);
      expect(song_id).toEqual('song_id');
      expect(emitMock).toHaveBeenCalled();
    });
    it('should handle the choose category and set the state correctly for phase 3', async () => {
      // Set the initial state
      useRoomStore.setState({
        room_code: 'TEST123',
        selectMode: false,
      });

      // Mock the axios.post method to return some data
      jest.spyOn(axios, 'post').mockResolvedValueOnce({
        data: {
          data: {
            song_id: 'song_id',
          },
        },
      });

      // Call the handleChooseCategory function
      await useRoomStore.getState().handleChooseCategory('song_id', 3, socket);

      // Check that the state is set correctly
      expect(useRoomStore.getState().selectMode).toEqual(false);
    });
  });

  describe('updateSettings', () => {
    it('should update the settings and set the state correctly', async () => {
      // Set the initial state
      useRoomStore.setState({
        room_code: 'room_code',
        maxRoundsPhaseOne: 2,
        maxRoundsPhaseTwo: 2,
      });

      // Mock the axios.put method to return some data
      jest.spyOn(axios, 'put').mockResolvedValueOnce({
        status: 200,
        data: {
          message: 'Settings updated successfully',
        },
      });

      // Call the updateSettings function
      await useRoomStore.getState().updateSettings(3, 3);

      // Check that the state is set correctly
      expect(useRoomStore.getState().maxRoundsPhaseOne).toEqual(3);
      expect(useRoomStore.getState().maxRoundsPhaseTwo).toEqual(3);
    });
  });
});
