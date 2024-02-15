import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Redirecter from '@/components/Redirecter';
import { WikiEditor } from '@/components/editor/WikiEditor';
import { getCurrentUrl } from '@/utils/GetCurrentUrl';
import { getServerSession } from 'next-auth';
import React from 'react';

async function getWiki(wikiId: string, session?: any) {
  try {
    const post = await fetch(getCurrentUrl() + `/externalApi/wikis/${wikiId}`, {
      cache: 'no-store',
    }).then(res => res.json());
    // if (!post._id) {
    //   post = await fetch(getCurrentUrl() + `/externalApi/wikis/`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     cache: 'no-store',
    //     body: JSON.stringify({
    //       author: {
    //         _id: session?.user._id,
    //         username: session?.user.username,
    //       },
    //     }),
    //   }).then(res => res.json());
    // }
    return post;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function Page({ params }: { params: { wikiId: string } }) {
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
  const wiki = await getWiki(params.wikiId, session);
  if (!wiki) {
    return (
      <Redirecter
        url={`/`}
        message={`The article you tried to edit does not exist and we could not create a new one for you.`}
        variant={'default'}
      />
    );
  } else {
    return <WikiEditor wiki={wiki} />;
  }
}
