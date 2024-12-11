'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload } from 'lucide-react';

export default function ImageUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const addImage = useStore((state) => state.addImage);
  const setCurrentImage = useStore((state) => state.setCurrentImage);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageId = Math.random().toString(36).substr(2, 9);
        const newImage = {
          id: imageId,
          url: event.target?.result as string,
          timestamp: Date.now(),
          annotations: [],
        };
        addImage(newImage);
        setCurrentImage(imageId);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card
      className={`p-8 border-2 border-dashed ${
        isDragging ? 'border-primary' : 'border-muted'
      } rounded-lg text-center`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center space-y-4">
        <Upload className="w-12 h-12 text-muted-foreground" />
        <p className="text-lg font-medium">Drag and drop an image here</p>
        <p className="text-sm text-muted-foreground">or</p>
        <Button
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  const imageId = Math.random().toString(36).substr(2, 9);
                  const newImage = {
                    id: imageId,
                    url: event.target?.result as string,
                    timestamp: Date.now(),
                    annotations: [],
                  };
                  addImage(newImage);
                  setCurrentImage(imageId);
                };
                reader.readAsDataURL(file);
              }
            };
            input.click();
          }}
        >
          Choose a file
        </Button>
      </div>
    </Card>
  );
}