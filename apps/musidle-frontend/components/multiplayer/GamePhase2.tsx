'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import GameMultiplayerLayout from './GameMultiplayerLayout';
import { useRoomStore } from '@/stores/RoomStore';
import { useAnswerStore } from '@/stores/AnswerStore';
import { useSocketStore } from '@/stores/SocketStore';
import { useSession } from 'next-auth/react';
import GameInstructionsHover from '../game-related/GameInstructionsHover';

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
        <div className=" xl:w-[67%] w-full xl:h-full h-[50%] flex flex-col justify-center items-center min-w-[180px] relative top-0 right-0 xl:p-0 py-6 mx-2">
          <Card className="h-full w-full">
            <CardHeader className=" text-center h-[12%] w-full">
              <div className="flex justify-between items-center">
                <label className=" w-24 font-semibold text-xs flex justify-center items-center">
                  v{process.env.NEXT_PUBLIC_VERSION}
                </label>
                <div>
                  <CardTitle>Choose an artist</CardTitle>
                </div>
                <GameInstructionsHover />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 w-full">
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
          </Card>
        </div>
      )}
    </>
  );
}

export default GamePhase2;
