'use client';
import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Link from 'next/link';

export default function WikiSearch() {
  const [search, setSearch] = React.useState('');
  return (
    <>
      <Input
        placeholder="Search..."
        type="search"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-1"
      />
      <Link href={`/wiki?search=${search}`}>
        <Button className="w-full">Search</Button>
      </Link>
    </>
  );
}
