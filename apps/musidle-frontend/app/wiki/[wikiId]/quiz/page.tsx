import { IQuiz } from 'apps/musidle-frontend/@types/Quiz';
import Quiz from 'apps/musidle-frontend/components/Quiz';
import Redirecter from 'apps/musidle-frontend/components/Redirecter';
import WikiNavbar from 'apps/musidle-frontend/components/wiki/WikiNavbar';
import { getCurrentUrl } from 'apps/musidle-frontend/utils/GetCurrentUrl';
import React from 'react';

async function getQuizData({ wikiId }: { wikiId: string }) {
  try {
    const quizData: IQuiz[] = await fetch(getCurrentUrl() + `/externalApi/quizes/${wikiId}`, {
      next: {
        revalidate: 60,
      },
    }).then(res => res.json());
    return quizData;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export default async function QuizPage({ params }: { params: { wikiId: string } }) {
  const quizData = await getQuizData(params);
  if (!quizData || quizData.length < 3) {
    return (
      <Redirecter
        url={`/`}
        message={`The quiz you tried to open does not exist.`}
        variant={'default'}
      />
    );
  }
  return (
    <div className="flex flex-col min-h-screen h-full w-full">
      <div className="flex items-center justify-start h-20 py-10 px-4 md:px-6 lg:px-8 ">
        <h1 className="text-3xl font-bold">Quiz</h1>
      </div>
      <WikiNavbar id={quizData[0].artistId} />
      <div className="flex-1 py-10 px-4 md:px-6 lg:px-8">
        <Quiz quizData={quizData} />
      </div>
    </div>
  );
}
