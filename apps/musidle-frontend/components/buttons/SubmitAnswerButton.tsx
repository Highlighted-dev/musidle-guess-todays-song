'use client';
import React from 'react';
import { Button } from '../ui/button';
import { useAnswerStore } from '@/stores/AnswerStore';

export default function SubmitAnswerButton({
  className,
  disabled,
}: {
  className: string;
  disabled: boolean;
}) {
  const { handleAnswerSubmit } = useAnswerStore();
  return (
    <Button className={className} disabled={disabled} onClick={handleAnswerSubmit}>
      Submit
    </Button>
  );
}
