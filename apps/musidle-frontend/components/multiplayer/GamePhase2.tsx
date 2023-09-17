import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import GameMultiplayerLayout from './GameMultiplayerLayout';
import { useAuthStore } from '@/stores/AuthStore';
import { useRoomStore } from '@/stores/RoomStore';
import Leaderboard from './Leaderboard';
import { useAnswerStore } from '@/stores/AnswerStore';
import { useSocketStore } from '@/stores/SocketStore';

const GamePhase2 = () => {
  const { user_id } = useAuthStore();
  const { currentPlayer, selectMode, handleChooseCategory } = useRoomStore();
  const { artist, revealArtist, possibleSongs } = useAnswerStore();

  const changeSongToCompleted = (song_id: string) => {
    //Change "completed" boolean in possibleSongs for song with song_id to true
    const possibleSongs = useAnswerStore.getState().possibleSongs;

    possibleSongs.map((song: { song_id: string; completed: boolean }) => {
      if (song.song_id == song_id) {
        song.completed = true;
      }
    });
    return possibleSongs;
  };

  return (
    <>
      {selectMode ? (
        <GameMultiplayerLayout />
      ) : (
        <div className="h-4/5 w-[90%] flex xl:flex-row xl:relative flex-col justify-center align-center">
          <Card className="h-full w-full float-left xl:w-4/6 flex flex-col">
            <CardHeader className=" text-center">
              <CardTitle className=" font-bold">Choose an artist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {possibleSongs
                  .filter(song => song.category == 'artists')
                  ?.map((song, index) => (
                    <Button
                      key={index}
                      variant={'secondary'}
                      onClick={e => {
                        revealArtist(e.currentTarget.id);
                        const possibleSongs = changeSongToCompleted(e.currentTarget.id);
                        if (currentPlayer?._id == user_id) {
                          useSocketStore
                            .getState()
                            .socket?.emit(
                              'changeSongToCompleted',
                              possibleSongs,
                              useRoomStore.getState().room_code,
                              song.song_id,
                            );
                        }
                        setTimeout(() => {
                          useAnswerStore.getState().setPossibleSongs(possibleSongs);
                          handleChooseCategory(song.category, 2);
                        }, 3000);
                      }}
                      id={song.song_id}
                      disabled={
                        currentPlayer?._id == user_id &&
                        !possibleSongs.find(possibleSong => possibleSong.song_id == song.song_id)
                          ?.completed
                          ? false
                          : true
                      }
                      className="p-[25px]"
                    >
                      <label
                        className={
                          artist == song.artist ||
                          possibleSongs.find(possibleSong => possibleSong.song_id == song.song_id)
                            ?.completed
                            ? 'pointer-events-none'
                            : 'blur-sm cursor-pointer'
                        }
                        id={`label_artist${index}`}
                      >
                        {artist == song.artist ||
                        possibleSongs.find(possibleSong => possibleSong.song_id == song.song_id)
                          ?.completed
                          ? song.artist
                          : '******* *** **********'}
                      </label>
                    </Button>
                  ))}
              </div>
            </CardContent>
          </Card>
          <Leaderboard />
        </div>
      )}
    </>
  );
};

export default GamePhase2;
