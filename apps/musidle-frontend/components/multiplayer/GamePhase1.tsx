'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useEffect, useState } from 'react';
import GameMultiplayerLayout from './GameMultiplayerLayout';
import { Label } from '../ui/label';
import { useAuthStore } from '@/stores/AuthStore';
import { useRoomStore } from '@/stores/RoomStore';
import axios from 'axios';
import Leaderboard from './Leaderboard';

export default function GamePhase1() {
  const { user_id } = useAuthStore();
  const { players, currentPlayer, selectMode, handleChooseCategory } = useRoomStore();
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (!user_id || categories.length > 0) return;
    axios.get('/api/categories').then(res => {
      res.data.map((item: { _id: string; category: string }) =>
        setCategories(prev => [...prev, item.category]),
      );
    });
  }, [user_id]);

  return (
    <>
      {selectMode ? (
        <GameMultiplayerLayout />
      ) : (
        <>
          <Card className="h-full w-full">
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
                      disabled={currentPlayer?._id == user_id ? false : true}
                      key={index}
                    >
                      <div className=" flex flex-row justify-center items-center relative w-full">
                        <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                        <span className="absolute left-[98%] text-gray-400">1/1</span>
                      </div>
                    </Button>
                  ))}
              </div>
            </CardContent>
          </Card>
          <Leaderboard />
        </>
      )}
    </>
  );
}
