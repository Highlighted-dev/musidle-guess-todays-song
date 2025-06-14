'use client';
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import { useAnswerStore } from '../../stores/AnswerStore';
import { useRoomStore } from '../../stores/RoomStore';

export default function TurnChangeDialog({
  displayPlayerName = true,
}: {
  displayPlayerName?: boolean;
}) {
  const [progress, setProgress] = React.useState(0);
  const { value, answer, possibleAnswers } = useAnswerStore();
  const { turnChangeDialogOpen, round, currentPlayer } = useRoomStore();
  useEffect(() => {
    if (turnChangeDialogOpen) {
      //update progress bar 4 times, once every 900ms
      const timer = setInterval(() => {
        setProgress(prevProgress => (prevProgress >= 100 ? 0 : prevProgress + 25));
      }, 900);
      return () => {
        clearInterval(timer);
        setProgress(0);
      };
    }
  }, [turnChangeDialogOpen]);

  return (
    <Dialog
      open={turnChangeDialogOpen}
      onOpenChange={() => {
        return;
      }}
    >
      <DialogContent className="text-center">
        <DialogHeader>
          <DialogTitle className="text-center">Round {round}</DialogTitle>
        </DialogHeader>
        <h1 className="text-base text-center">
          {answer && value.toLowerCase().includes(answer.toLowerCase()) ? (
            <Label className="text-green-500 font-bold"> CORRECT</Label>
          ) : (
            <Label className="text-red-700 font-bold"> INCORRECT</Label>
          )}
        </h1>
        <Label className="text-center">
          {`You guessed: ${
            possibleAnswers.find(song => song.value.toLowerCase() === value.toLowerCase())?.value ||
            value ||
            'Nothing :('
          }`}
        </Label>
        <Label className="text-center">The correct answer was: {answer}</Label>
        <br />
        {displayPlayerName && (
          <h1 className="text-bold text-base">{currentPlayer?.name}&apos;s turn</h1>
        )}
        <DialogFooter className="text-center">
          <Progress value={progress} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
