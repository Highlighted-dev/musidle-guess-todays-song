'use client';
import React from 'react';
import { Button } from '../ui/button';
import { useAnswerStore } from '@/stores/AnswerStore';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export default function SubmitAnswerButton({
  className,
  disabled,
  router,
}: {
  className: string;
  disabled?: boolean;
  router?: AppRouterInstance;
}) {
  const { handleAnswerSubmit } = useAnswerStore();
  const { value } = useAnswerStore();
  return (
    <Button
      className={className}
      disabled={disabled || !value}
      onClick={() => handleAnswerSubmit(router)}
    >
      Submit
    </Button>
  );
}
