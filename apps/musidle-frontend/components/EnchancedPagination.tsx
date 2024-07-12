'use client';
import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export default function EnchancedPagination({
  pageNumber,
  url,
}: {
  pageNumber: number;
  url: string;
}) {
  const previousPageNumber = pageNumber === 1 ? 1 : pageNumber - 1;
  const nextPageNumber = pageNumber === 1 ? 2 : pageNumber + 1;

  const generateURLs = (pageNumber: number) => `${url}${pageNumber}`;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationPrevious href={generateURLs(previousPageNumber)} />
        <PaginationLink href={generateURLs(previousPageNumber)} isActive={pageNumber === 1}>
          {previousPageNumber}
        </PaginationLink>
        <PaginationLink
          href={generateURLs(pageNumber === 1 ? 2 : pageNumber)}
          isActive={pageNumber !== 1}
        >
          {pageNumber === 1 ? 2 : pageNumber}
        </PaginationLink>
        <PaginationLink href={generateURLs(pageNumber === 1 ? 3 : pageNumber + 1)}>
          {pageNumber === 1 ? 3 : pageNumber + 1}
        </PaginationLink>
        <PaginationEllipsis />
        <PaginationNext href={generateURLs(nextPageNumber)} />
      </PaginationContent>
    </Pagination>
  );
}
