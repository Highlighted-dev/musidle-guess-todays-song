import Redirecter from '@/components/Redirecter';
import { getCurrentUrl } from '@/utils/GetCurrentUrl';
import '../../../styles/editor.css';
import React from 'react';
import { Separator } from '@/components/ui/separator';
import DOMPurify from 'isomorphic-dompurify';
import EditButton from '@/components/EditButton';
import { auth } from '@/auth';
import { Metadata } from 'next';
import { IArticle } from '@/@types/Article';

type Props = {
  params: { articleId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.articleId;
  const article = await getArticle(id);

  if (!article) {
    return {
      title: 'Musidle Articles',
    };
  }
  return {
    title: article.title,
    openGraph: {
      title: article.title,
      siteName: 'Musidle',
      // images: [
      //   {
      //     url: article.coverImage.url,
      //     width: 800,
      //     height: 600,
      //     alt: article.title + ' Image',
      //   },
      // ],
    },
  };
}

async function getArticle(articleId: string) {
  try {
    const post = await fetch(getCurrentUrl() + `/externalApi/articles/${articleId}`, {
      cache: 'no-cache',
    }).then(res => res.json());
    return post as IArticle;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function Articles({ params }: { params: { articleId: string } }) {
  const articleData = await getArticle(params.articleId);
  const session = await auth();
  if (!articleData) {
    <Redirecter
      url={`/`}
      message={`The article you tried to open does not exist.`}
      variant={'default'}
    />;
  }
  const sanitizedHTML = () => {
    return { __html: DOMPurify.sanitize(articleData?.content) };
  };
  return (
    <div className="h-full w-full py-12">
      <div className="container px-4 md:px-6">
        <div className="flex">
          <h1 className="text-5xl font-bold">{articleData?.title}</h1>
          {session?.user.role == 'admin' ? (
            <EditButton url={`/admin/editor/articles/${articleData?._id}`} />
          ) : null}
        </div>
        <Separator className="my-4" />
        <div
          dangerouslySetInnerHTML={sanitizedHTML()}
          id={'editor'}
          className="prose prose-invert max-w-none"
        />
      </div>
    </div>
  );
}
