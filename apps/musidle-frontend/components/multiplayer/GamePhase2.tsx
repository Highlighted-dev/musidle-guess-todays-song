'use client';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import GameMultiplayerLayout from './GameMultiplayerLayout';
import { useRoomStore } from '@/stores/RoomStore';
import { useAnswerStore } from '@/stores/AnswerStore';
import { useSocketStore } from '@/stores/SocketStore';
import { useSession } from 'next-auth/react';

function GamePhase2() {
  const user = useSession().data?.user;
  const { currentPlayer, selectMode, handleChooseCategory } = useRoomStore();
  const { artist, revealArtist, possibleSongs, changeSongToCompleted } = useAnswerStore();
  const [choosingArtist, setChoosingArtist] = React.useState(false);

  return (
    <>
      {selectMode ? (
        <GameMultiplayerLayout />
      ) : (
        <div className=" h-full">
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
                      setChoosingArtist(true);
                      revealArtist(song.songId);
                      if (currentPlayer?._id == user?._id) {
                        useSocketStore
                          .getState()
                          .socket?.emit(
                            'changeSongToCompleted',
                            useRoomStore.getState().roomCode,
                            song.songId,
                          );
                      }
                      setTimeout(() => {
                        changeSongToCompleted(song.songId);
                        handleChooseCategory(song.songId, 2);
                        setChoosingArtist(false);
                      }, 3000);
                    }}
                    id={song.songId}
                    disabled={
                      currentPlayer?._id != user?._id ||
                      possibleSongs.find(possibleSong => possibleSong.songId == song.songId)
                        ?.completed ||
                      choosingArtist
                        ? true
                        : false
                    }
                    className="p-[25px]"
                  >
                    <label
                      className={
                        artist == song.artist ||
                        possibleSongs.find(possibleSong => possibleSong.songId == song.songId)
                          ?.completed
                          ? 'pointer-events-none'
                          : 'blur-sm cursor-pointer'
                      }
                      id={`label_artist${index}`}
                    >
                      {artist == song.artist ||
                      possibleSongs.find(possibleSong => possibleSong.songId == song.songId)
                        ?.completed
                        ? song.artist
                        : '******* *** **********'}
                    </label>
                  </Button>
                ))}
            </div>
          </CardContent>
        </div>
      )}
    </>
  );
}

export default GamePhase2;
