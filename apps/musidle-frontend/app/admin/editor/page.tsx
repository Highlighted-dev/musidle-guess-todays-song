import Editor from '@/components/admin/editor';
import React from 'react';

export default async function Page() {
  return <Editor post={{ title: 'test' }} />;
}
