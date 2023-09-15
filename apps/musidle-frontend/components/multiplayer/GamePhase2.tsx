import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useEffect, useState } from 'react';
import GameMultiplayerLayout from './GameMultiplayerLayout';
import { useAuthStore } from '@/stores/AuthStore';
import { useRoomStore } from '@/stores/RoomStore';
import Leaderboard from './Leaderboard';
import { useAnswerStore } from '@/stores/AnswerStore';
import { set } from 'mongoose';
import axios from 'axios';

const GamePhase2 = () => {
  const { user_id } = useAuthStore();
  const { currentPlayer, selectMode, handleChooseCategory, players, room_code } = useRoomStore();
  const { artist, revealArtist } = useAnswerStore();

  const [songs, setSongs] = useState<any[]>([]);

  useEffect(() => {
    if (!user_id || songs.length > 0) return;
    axios.get(`/api/rooms/${room_code}`).then(res => {
      res.data.songs.map(
        (item: {
          _id: string;
          song_id: string;
          category: string;
          completed: string;
          artist?: string;
        }) => {
          if (item.category == 'artists') {
            setSongs(prev => [...prev, item]);
          }
        },
      );
    });
  }, [user_id]);

  // const isCategoryCompleted = (category: string) => {
  //   return players
  //     .find(player => player._id == user_id)
  //     ?.completedCategories.find((item: any) => item.category == category).completed;
  // };

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
                {
                  // renderButtons()
                  songs.map((song, index) => (
                    <Button
                      key={index}
                      variant={'secondary'}
                      onClick={e => {
                        revealArtist(e.currentTarget.id);
                        setTimeout(() => {
                          handleChooseCategory(song.category, 2);
                        }, 3000);
                      }}
                      id={song.song_id}
                      disabled={currentPlayer?._id == user_id ? false : true}
                      className="p-[25px]"
                    >
                      <label
                        className={
                          artist == song.artist ? 'cursor-pointer' : 'blur-sm cursor-pointer'
                        }
                        id={`label_artist${index}`}
                      >
                        {artist == song.artist ? song.artist : '******* *** **********'}
                      </label>
                    </Button>
                  ))
                }
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
