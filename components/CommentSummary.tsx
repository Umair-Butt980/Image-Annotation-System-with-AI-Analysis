'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { generateCommentSummary, analyzeImageChanges } from '@/lib/ai';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export default function CommentSummary() {
  const images = useStore((state) => state.images);
  const [summary, setSummary] = useState<string>('');
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    const processSummary = async () => {
      if (images.length > 0) {
        const latestImage = images[images.length - 1];
        const summaryText = await generateCommentSummary(latestImage.annotations);
        setSummary(summaryText || '');

        if (images.length > 1) {
          const previousImage = images[images.length - 2];
          const changeAnalysis = await analyzeImageChanges(
            summaryText || '',
            previousImage.annotations
          );
          setAnalysis(changeAnalysis);
        }
      }
    };

    processSummary();
  }, [images]);

  const openChatGPT = () => {
    if (images.length === 0) return;
    
    const latestImage = images[images.length - 1];
    const comments = latestImage.annotations
      .map(a => `- ${a.comment}`)
      .join('\n');
    
    const prompt = `Please analyze these image comments and create a checklist of actionable items:\n\n${comments}`;
    
    window.open(`https://chat.openai.com/?model=gpt-3.5-turbo#prompt=${encodeURIComponent(prompt)}`, '_blank');
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Comment Summary</h3>
        <Button 
          variant="outline" 
          onClick={openChatGPT}
          disabled={images.length === 0}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Analyze with ChatGPT
        </Button>
      </div>
      
      {summary ? (
        <div className="space-y-2">
          {summary.split('\n').map((item, index) => (
            <div key={index} className="flex items-start space-x-2">
              <Checkbox
                checked={analysis?.[index]?.completed}
                className="mt-1"
                disabled
              />
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          {images.length === 0 
            ? "Upload an image and add comments to get started" 
            : "Click the button above to analyze your comments with ChatGPT"}
        </p>
      )}
    </Card>
  );
}