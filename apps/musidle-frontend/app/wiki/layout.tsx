import WikiSearch from 'apps/musidle-frontend/components/wiki/WikiSearch';
import Link from 'next/link';
import React from 'react';

export default async function WikiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[300px_1fr] w-full">
      <div className="px-6 py-8 lg:min-h-screen border">
        <div className="space-y-4">
          <div className="space-y-2">
            <WikiSearch />
          </div>
          <div className="grid gap-2">
            <Link className="flex items-center gap-2" href="/wiki?tag=pop">
              Pop{'\n'}
              <span className="ml-auto text-xs ">2</span>
            </Link>
            <Link className="flex items-center gap-2" href="/wiki?tag=metal">
              Metal{'\n'}
              <span className="ml-auto text-xs ">1</span>
            </Link>
            <Link className="flex items-center gap-2" href="/wiki?tag=hip-hop">
              Hip-Hop{'\n'}
              <span className="ml-auto text-xs ">2</span>
            </Link>
            <Link className="flex items-center gap-2" href="/wiki?tag=rap">
              Rap{'\n '}
              <span className="ml-auto text-xs ">1</span>
            </Link>
            <Link className="flex items-center gap-2" href="/wiki?tag=female%20vocalists">
              Female vocalists{'\n '}
              <span className="ml-auto text-xs ">2</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-4 p-6 lg:min-h-screen border-b">{children}</div>
    </div>
  );
}
