import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Redirecter from '@/components/Redirecter';
import Editor from '@/components/admin/editor';
import { getCurrentUrl } from '@/utils/GetCurrentUrl';
import { getServerSession } from 'next-auth';
import React from 'react';

async function getArticle(articleId: string, session?: any) {
  let post = await fetch(getCurrentUrl() + `/externalApi/articles/${articleId}`, {
    cache: 'no-store',
  }).then(res => res.json());

  if (!post) {
    post = await fetch(getCurrentUrl() + `/externalApi/articles/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      body: JSON.stringify({
        title: 'test',
        content: '',
        author: {
          _id: session?.user._id,
          username: session?.user.username,
        },
      }),
    }).then(res => res.json());
  }
  return post;
}

export default async function Page({ params }: { params: { articleId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user.role || session?.user.role !== 'admin') {
    return (
      <Redirecter
        url={`/`}
        message={`You are not authorized to edit articles.`}
        variant={'default'}
      />
    );
  }
  const article = await getArticle(params.articleId, session);
  if (article._id != params.articleId) {
    return (
      <Redirecter
        url={`/admin/editor/${article._id}`}
        message={`The article you triedto edit does not exist, but we created a new one for you.`}
        variant={'default'}
      />
    );
  } else {
    return <Editor post={article} />;
  }
}
