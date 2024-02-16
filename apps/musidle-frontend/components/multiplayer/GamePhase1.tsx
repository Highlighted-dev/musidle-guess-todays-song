'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import React from 'react';
import GameMultiplayerLayout from './GameMultiplayerLayout';
import { useRoomStore } from '@/stores/RoomStore';
import { useSession } from 'next-auth/react';
import { IPlayerCategories } from '@/@types/Categories';
import { useAnswerStore } from '@/stores/AnswerStore';
import GameHeader from './GameHeader';

export default function GamePhase1() {
  const user = useSession().data?.user;
  const { players, currentPlayer, selectMode, handleChooseCategory } = useRoomStore();
  const { categories } = useAnswerStore();

  const isCategoryCompleted = (category: string | undefined) => {
    if (!category) return false;
    return players
      .find(player => player._id == user?._id)
      ?.completedCategories.find((item: IPlayerCategories) => item.category == category).completed;
  };
  return (
    <>
      {selectMode ? (
        <GameMultiplayerLayout />
      ) : (
        <Card className="w-full flex flex-col justify-center items-center min-w-[200px] lg:p-0 py-6 lg:mx-2 min-h-[700px]">
          <GameHeader title="Phase 1" />
          <CardContent className=" w-full p-4">
            <div className="flex flex-col space-y-4 w-full min-h-[600px]">
              {categories &&
                categories.length > 0 &&
                categories?.map((category, index) => (
                  <Button
                    variant={'outline'}
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
                      <span className="absolute left-[98%] ">
                        {isCategoryCompleted(category) ? <span>0/1</span> : <span>1/1</span>}
                      </span>
                    </div>
                  </Button>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
