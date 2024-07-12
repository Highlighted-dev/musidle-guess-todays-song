import { auth } from '@/auth';
import Redirecter from '@/components/Redirecter';
import { ArticleEditor } from '@/components/editor/ArticleEditor';
import { getCurrentUrl } from '@/utils/GetCurrentUrl';
import { Session } from 'next-auth';
import React from 'react';

async function getArticle(articleId: string, session?: Session | null) {
  try {
    let post = await fetch(getCurrentUrl() + `/externalApi/articles/${articleId}`, {
      cache: 'no-cache',
    }).then(res => res.json());
    if (!post._id) {
      post = await fetch(getCurrentUrl() + `/externalApi/articles/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache',
        body: JSON.stringify({
          author: {
            id: session?.user.id,
            name: session?.user.name,
          },
        }),
      }).then(res => res.json());
    }
    return post;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function Page({ params }: { params: { articleId: string } }) {
  const session = await auth();

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
  if (!article) {
    return (
      <Redirecter
        url={`/`}
        message={`The article you tried to edit does not exist and we could not create a new one for you.`}
        variant={'default'}
      />
    );
  } else if (article._id != params.articleId) {
    return (
      <Redirecter
        url={`/admin/editor/articles/${article._id}`}
        message={`The article you tried to edit does not exist, but we created a new one for you.`}
        variant={'default'}
      />
    );
  } else {
    return (
      <ArticleEditor
        url={getCurrentUrl() + `/externalApi/articles/${article._id}`}
        name={article.title}
        content={article.content}
      />
    );
  }
}
