'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import GameMultiplayerLayout from './GameMultiplayerLayout';
import { useRoomStore } from '@/stores/RoomStore';
import { useSession } from 'next-auth/react';
import { IPlayerCategories } from '@/@types/Categories';
import { useAnswerStore } from '@/stores/AnswerStore';

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
  // className =
  //   ' flex flex-col justify-center relative items-center xl:h-full h-[50%] xl:w-[67%] w-full xl:min-h-0 mx-2';
  return (
    <>
      {selectMode ? (
        <GameMultiplayerLayout />
      ) : (
        <div className=" xl:w-[67%] w-full xl:h-full h-[50%] flex flex-col justify-center items-center min-w-[180px] relative top-0 right-0 xl:p-0 py-6 mx-2">
          <Card className="h-full w-full">
            <CardHeader className=" text-center">
              <CardTitle>Choose category</CardTitle>
            </CardHeader>
            <CardContent className="h-full w-full">
              <div className="flex flex-col space-y-4 w-full">
                {categories &&
                  categories.length > 0 &&
                  categories?.map((category, index) => (
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
        </div>
      )}
    </>
  );
}
