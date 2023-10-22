'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useEffect, useState } from 'react';
import GameMultiplayerLayout from './GameMultiplayerLayout';
import { Label } from '../ui/label';
import { useRoomStore } from '@/stores/RoomStore';
import axios from 'axios';
import Leaderboard from './Leaderboard';
import { useSession } from 'next-auth/react';

export default function GamePhase1() {
  const user = useSession().data?.user;
  const { players, currentPlayer, selectMode, handleChooseCategory } = useRoomStore();
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (!user?._id || categories.length > 0) return;
    axios.get('/externalApi/categories').then(res => {
      res.data.map((item: { _id: string; category: string }) =>
        setCategories(prev => [...prev, item.category]),
      );
    });
  }, [user?._id]);

  const isCategoryCompleted = (category: string) => {
    return players
      .find(player => player._id == user?._id)
      ?.completedCategories.find((item: any) => item.category == category).completed;
  };

  return (
    <>
      {selectMode ? (
        <GameMultiplayerLayout />
      ) : (
        <div className="h-4/5 w-[90%] flex xl:flex-row xl:relative flex-col justify-center align-center">
          <Card className="float-left xl:w-4/6 flex flex-col">
            <CardHeader className=" text-center">
              <CardTitle>Choose category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                {categories.length > 0 &&
                  categories.map((category, index) => (
                    <Button
                      variant={'secondary'}
                      onClick={e => handleChooseCategory(e.currentTarget.id, 1)}
                      id={category}
                      disabled={
                        currentPlayer?._id == user?._id && !isCategoryCompleted(category)
                          ? false
                          : true
                      }
                      key={index}
                    >
                      <div className=" flex flex-row justify-center items-center relative w-full">
                        <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                        <span className="absolute left-[98%] text-gray-400">
                          {isCategoryCompleted(category) ? <span>0/1</span> : <span>1/1</span>}
                        </span>
                      </div>
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
}
