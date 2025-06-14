'use client';
import { Popover } from '../ui/popover';
import { PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { Button } from '../ui/button';
import { LuPlay } from 'react-icons/lu';

export function PlayEmbed({ url }: { url: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost">
          <LuPlay className="h-6 w-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-20">
        <iframe
          width={'100%'}
          height={'200px'}
          src={url + '?autoplay=true'}
          title="Youtube embeds on Musidle"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </PopoverContent>
    </Popover>
  );
}

export default PlayEmbed;
