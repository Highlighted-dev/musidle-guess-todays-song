import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import GameMultiplayerLayout from './GameMultiplayerLayout';
import { useRoomStore } from '@/stores/RoomStore';
import Leaderboard from './Leaderboard';
import { useAnswerStore } from '@/stores/AnswerStore';
import { useSocketStore } from '@/stores/SocketStore';
import { useSession } from 'next-auth/react';

const GamePhase2 = () => {
  const user = useSession().data?.user;
  const { currentPlayer, selectMode, handleChooseCategory } = useRoomStore();
  const { artist, revealArtist, possibleSongs, changeSongToCompleted } = useAnswerStore();
  const [choosingArtist, setChoosingArtist] = React.useState(false);

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
                        setChoosingArtist(true);
                        revealArtist(song.song_id);
                        if (currentPlayer?._id == user?._id) {
                          useSocketStore
                            .getState()
                            .socket?.emit(
                              'changeSongToCompleted',
                              useRoomStore.getState().room_code,
                              song.song_id,
                            );
                        }
                        setTimeout(() => {
                          changeSongToCompleted(song.song_id);
                          handleChooseCategory(song.song_id, 2);
                          setChoosingArtist(false);
                        }, 3000);
                      }}
                      id={song.song_id}
                      disabled={
                        currentPlayer?._id != user?._id ||
                        possibleSongs.find(possibleSong => possibleSong.song_id == song.song_id)
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
