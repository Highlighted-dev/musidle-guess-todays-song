'use client';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import React from 'react';
import GameMultiplayerLayout from './GameMultiplayerLayout';
import { useRoomStore } from '../../stores/RoomStore';
import { useAnswerStore } from '../../stores/AnswerStore';
import { useSocketStore } from '../../stores/SocketStore';
import GameHeader from '../game-related/GameHeader';
import { Session } from 'next-auth';

function GamePhase2({ session }: { session: Session | null }) {
  const user = session?.user;
  const { currentPlayer, selectMode, handleChooseCategory } = useRoomStore();
  const { artist, revealArtist, possibleSongs, changeSongToCompleted } = useAnswerStore();
  const [choosingArtist, setChoosingArtist] = React.useState(false);

  return (
    <>
      {selectMode ? (
        <GameMultiplayerLayout session={session} />
      ) : (
        <Card className="w-full flex flex-col justify-center items-center min-w-[200px] lg:p-0 py-6 lg:mx-2 min-h-[700px]">
          <GameHeader title="Phase 2" />
          <CardContent className="w-full p-4">
            <div className="grid grid-cols-2 gap-4 w-full min-h-[610px]">
              {possibleSongs
                .filter(song => song.category == 'artists')
                ?.map((song, index) => (
                  <Button
                    key={index}
                    variant={'secondary'}
                    onClick={e => {
                      setChoosingArtist(true);
                      revealArtist(song.songId);
                      if (currentPlayer?.id == user?.id) {
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
                      currentPlayer?.id != user?.id ||
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
      )}
    </>
  );
}

export default GamePhase2;
