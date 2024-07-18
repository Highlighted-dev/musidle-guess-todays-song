'use client';
import React from 'react';
import { IQuiz } from '../../@types/Quiz';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Pagination, PaginationContent, PaginationEllipsis } from '../ui/pagination';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { toast } from '../ui/use-toast';

export default function Quiz({ quizData }: { quizData: IQuiz[] }) {
  const [currentQuestion, setCurrentQuestion] = React.useState(1);

  const calculateWhatNumberToDisplay = (currentQuestion: number) => {
    if (currentQuestion == 1) {
      return [1, 2, 3];
    } else if (currentQuestion == quizData.length) {
      return [currentQuestion - 2, currentQuestion - 1, currentQuestion];
    } else {
      return [currentQuestion - 1, currentQuestion, currentQuestion + 1];
    }
  };

  const onOptionClick = (option: string) => {
    if (option === quizData[currentQuestion - 1].answer) {
      if (currentQuestion !== quizData.length) setCurrentQuestion(currentQuestion + 1);
      return toast({
        title: 'Correct!',
        description: 'You got it right!',
        duration: 5000,
      });
    }
    return toast({
      title: 'Incorrect!',
      description: 'You got it wrong!',
      duration: 5000,
      variant: 'destructive',
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 grid-rows-4 gap-2 mb-8 max-w-[400px] m-auto">
        <Label>{quizData[currentQuestion - 1].question}</Label>
        {quizData[currentQuestion - 1].options.map((option, index) => (
          <Button key={index} onClick={() => onOptionClick(option)}>
            {option}
          </Button>
        ))}
      </div>
      <Pagination>
        <PaginationContent>
          <Button
            variant={'ghost'}
            onClick={() => setCurrentQuestion(currentQuestion <= 1 ? 1 : currentQuestion - 1)}
          >
            <LuChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>
          <Button
            className="px-4"
            variant={currentQuestion == 1 ? 'outline' : 'ghost'}
            onClick={() => setCurrentQuestion(calculateWhatNumberToDisplay(currentQuestion)[0])}
          >
            {calculateWhatNumberToDisplay(currentQuestion)[0]}
          </Button>
          <Button
            className="px-4"
            variant={currentQuestion > 1 && currentQuestion < quizData.length ? 'outline' : 'ghost'}
            onClick={() => setCurrentQuestion(calculateWhatNumberToDisplay(currentQuestion)[1])}
          >
            {calculateWhatNumberToDisplay(currentQuestion)[1]}
          </Button>
          <Button
            className="px-4"
            variant={currentQuestion == quizData.length ? 'outline' : 'ghost'}
            onClick={() => setCurrentQuestion(calculateWhatNumberToDisplay(currentQuestion)[2])}
          >
            {calculateWhatNumberToDisplay(currentQuestion)[2]}
          </Button>
          <Button
            variant={'ghost'}
            onClick={() =>
              setCurrentQuestion(
                currentQuestion >= quizData.length ? quizData.length : currentQuestion + 1,
              )
            }
          >
            <span>Next</span>
            <LuChevronRight className="h-4 w-4" />
          </Button>
        </PaginationContent>
      </Pagination>
    </>
  );
}
