import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import React from 'react';

export default async function LegalPage() {
  return (
    <div className="h-4/5 w-[90%] flex xl:flex-row xl:relative flex-col justify-center align-center relative min-h-[450px] prose prose-invert">
      <Card className="float-left xl:w-4/6 flex flex-col justify-center align-center h-full">
        <CardHeader className="text-center">
          <CardTitle className="font-bold">FAQ</CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <Label>
            <span className="font-bold">1. How is it legal?</span> - The person responsible for this
            website resides in Poland. According to Polish law, we have a{' '}
            <a href="https://en.wikipedia.org/wiki/Right_to_quote" className="underline">
              'quotation right'
            </a>
            , which allows us to use small excerpts of works for purposes such as commentary,
            criticism, and education. We use up to 12 seconds of a song (approximately 5.5% of an
            average song) in a way that we believe complies with this legal provision. This usage is
            strictly for educational and commentary purposes and not for commercial gain.
            Additionally, we ensure proper attribution to the original creators.
          </Label>
        </CardContent>
      </Card>
    </div>
  );
}
