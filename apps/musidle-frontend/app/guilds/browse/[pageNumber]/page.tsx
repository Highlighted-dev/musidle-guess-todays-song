import React from 'react';
import { IGuild } from 'apps/musidle-frontend/@types/Guild';
import { getCurrentUrl } from 'apps/musidle-frontend/utils/GetCurrentUrl';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from 'apps/musidle-frontend/components/ui/card';
import Link from 'next/link';
import JoinGuildButton from 'apps/musidle-frontend/components/buttons/JoinGuildButton';
import GuildPagination from 'apps/musidle-frontend/components/guilds/GuildPagination';
import Guilds from '../../page';

export default async function GuildBrowser({ params }: { params: { pageNumber: string } }) {
  return <Guilds pageNumber={parseInt(params.pageNumber)} />;
}
