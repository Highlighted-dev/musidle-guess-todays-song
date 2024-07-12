import { auth } from '@/auth';
import Redirecter from '@/components/Redirecter';
import { WikiEditor } from '@/components/editor/WikiEditor';
import { getCurrentUrl } from '@/utils/GetCurrentUrl';
import { Session } from 'next-auth';
import React from 'react';

async function getWiki(wikiId: string, session?: Session | null) {
  try {
    let post = await fetch(getCurrentUrl() + `/externalApi/wikis/${wikiId}`, {
      cache: 'no-cache',
    }).then(res => res.json());

    if (!post._id) {
      post = await fetch(getCurrentUrl() + `/externalApi/wikis/`, {
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
      console.log(post);
    }
    return post;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function Page({ params }: { params: { wikiId: string } }) {
  const session = await auth();

  if (!session?.user.role || session?.user.role !== 'admin') {
    return (
      <Redirecter url={`/`} message={`You are not authorized to edit wikis.`} variant={'default'} />
    );
  }
  const wiki = await getWiki(params.wikiId, session);
  if (!wiki) {
    return (
      <Redirecter
        url={`/`}
        message={`The wiki you tried to edit does not exist and we could not create a new one for you.`}
        variant={'default'}
      />
    );
  } else if (wiki._id != params.wikiId) {
    return (
      <Redirecter
        url={`/admin/editor/wiki/${wiki._id}`}
        message={`The wiki you tried to edit does not exist, but we created a new one for you.`}
        variant={'default'}
      />
    );
  } else {
    return <WikiEditor wiki={wiki} />;
  }
}
