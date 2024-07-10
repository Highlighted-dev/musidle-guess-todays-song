'use client';
import React from 'react';
import { Button } from '../ui/button';
import { useAnswerStore } from '../../stores/AnswerStore';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { ImSpinner2 } from 'react-icons/im';

export default function SubmitAnswerButton({
  className,
  disabled,
  router,
}: {
  className: string;
  disabled?: boolean;
  router?: AppRouterInstance;
}) {
  const { handleAnswerSubmit, loadingAnswer } = useAnswerStore();
  const { value } = useAnswerStore();
  return (
    <Button
      className={className}
      disabled={disabled || !value}
      onClick={() => handleAnswerSubmit(router)}
    >
      {loadingAnswer ? <ImSpinner2 className="mr-2 h-4 w-4 animate-spin" /> : 'Submit'}
    </Button>
  );
}
