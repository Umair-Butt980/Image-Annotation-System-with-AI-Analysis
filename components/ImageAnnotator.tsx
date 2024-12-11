'use client';

import React, { useState } from 'react';
import { useStore, type Annotation } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface ImageAnnotatorProps {
  imageUrl: string;
}

export default function ImageAnnotator({ imageUrl }: ImageAnnotatorProps) {
  const [selectedPoint, setSelectedPoint] = useState<{ x: number; y: number } | null>(null);
  const [comment, setComment] = useState('');
  const addAnnotation = useStore((state) => state.addAnnotation);
  const currentImageId = useStore((state) => state.currentImageId);
  const currentImage = useStore((state) => 
    state.images.find(img => img.id === currentImageId)
  );

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSelectedPoint({ x, y });
  };

  const handleSubmitComment = () => {
    if (selectedPoint && comment && currentImageId) {
      const annotation: Annotation = {
        id: Math.random().toString(36).substr(2, 9),
        x: selectedPoint.x,
        y: selectedPoint.y,
        comment,
        userId: 'user-1', // Replace with actual user ID
        timestamp: Date.now(),
      };
      addAnnotation(currentImageId, annotation);
      setSelectedPoint(null);
      setComment('');
    }
  };

  return (
    <div className="relative border rounded-lg overflow-hidden">
      <img
        src={imageUrl}
        alt="Annotatable image"
        className="max-w-full w-full h-auto cursor-crosshair"
        onClick={handleImageClick}
      />
      
      {currentImage?.annotations.map((annotation) => (
        <div
          key={annotation.id}
          className="absolute w-4 h-4 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${annotation.x}%`, top: `${annotation.y}%` }}
        >
          <div className="absolute left-4 top-4 bg-white p-2 rounded shadow-lg text-sm">
            {annotation.comment}
          </div>
        </div>
      ))}

      {selectedPoint && (
        <>
          <div
            className="absolute w-4 h-4 bg-red-500 rounded-full -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${selectedPoint.x}%`, top: `${selectedPoint.y}%` }}
          />
          <Card className="absolute bottom-4 left-4 right-4 p-4 space-y-4">
            <Input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add your comment..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmitComment();
                }
              }}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setSelectedPoint(null)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitComment}>Add Comment</Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}