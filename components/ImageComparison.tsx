'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ImageComparison() {
  const images = useStore((state) => state.images);
  const sortedImages = [...images].sort((a, b) => b.timestamp - a.timestamp);
  const [latest, previous] = sortedImages;

  if (!latest || !previous) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">Previous Version</h3>
        <img src={previous.url} alt="Previous version" className="w-full" />
        <ScrollArea className="h-48 mt-4">
          <div className="space-y-2">
            {previous.annotations.map((annotation) => (
              <div key={annotation.id} className="p-2 bg-muted rounded">
                <p className="text-sm">{annotation.comment}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">Latest Version</h3>
        <img src={latest.url} alt="Latest version" className="w-full" />
        <ScrollArea className="h-48 mt-4">
          <div className="space-y-2">
            {latest.annotations.map((annotation) => (
              <div key={annotation.id} className="p-2 bg-muted rounded">
                <p className="text-sm">{annotation.comment}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}