'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAnswerStore } from '@/stores/AnswerStore';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { ImSpinner2 } from 'react-icons/im';
import { Session } from 'next-auth';

export default function SubmitAnswerButton({
  className,
  disabled,
  router,
  session,
}: {
  className: string;
  disabled?: boolean;
  router?: AppRouterInstance;
  session: Session | null;
}) {
  const { handleAnswerSubmit, loadingAnswer } = useAnswerStore();
  const { value } = useAnswerStore();
  return (
    <Button
      className={className}
      disabled={disabled || !value}
      onClick={() => handleAnswerSubmit(router, session)}
    >
      {loadingAnswer ? <ImSpinner2 className="mr-2 h-4 w-4 animate-spin" /> : 'Submit'}
    </Button>
  );
}
