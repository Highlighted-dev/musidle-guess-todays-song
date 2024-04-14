'use client';
import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from 'apps/musidle-frontend/components/ui/pagination';

export default function GuildPagination({ pageNumber }: { pageNumber: number }) {
  const previousPageNumber = pageNumber === 1 ? 1 : pageNumber - 1;
  const nextPageNumber = pageNumber === 1 ? 2 : pageNumber + 1;

  const generateGuildURLs = (pageNumber: number) => `/guilds?page=${pageNumber}`;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationPrevious href={generateGuildURLs(previousPageNumber)} />
        <PaginationLink href={generateGuildURLs(previousPageNumber)} isActive={pageNumber === 1}>
          {previousPageNumber}
        </PaginationLink>
        <PaginationLink
          href={generateGuildURLs(pageNumber === 1 ? 2 : pageNumber)}
          isActive={pageNumber !== 1}
        >
          {pageNumber === 1 ? 2 : pageNumber}
        </PaginationLink>
        <PaginationLink href={generateGuildURLs(pageNumber === 1 ? 3 : pageNumber + 1)}>
          {pageNumber === 1 ? 3 : pageNumber + 1}
        </PaginationLink>
        <PaginationEllipsis />
        <PaginationNext href={generateGuildURLs(nextPageNumber)} />
      </PaginationContent>
    </Pagination>
  );
}
