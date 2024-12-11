'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useStore } from '@/lib/store';

const ImageUpload = dynamic(() => import('@/components/ImageUpload'), { ssr: false });
const ImageAnnotator = dynamic(() => import('@/components/ImageAnnotator'), { ssr: false });
const ImageComparison = dynamic(() => import('@/components/ImageComparison'), { ssr: false });
const CommentSummary = dynamic(() => import('@/components/CommentSummary'), { ssr: false });

export default function Home() {
  const currentImage = useStore((state) => 
    state.images.find(img => img.id === state.currentImageId)
  );

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-4xl font-bold text-center mb-8">Image Annotation System</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Upload New Image</h2>
          <Suspense fallback={<div>Loading...</div>}>
            <ImageUpload />
          </Suspense>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Current Image</h2>
          <Suspense fallback={<div>Loading...</div>}>
            {currentImage ? (
              <ImageAnnotator imageUrl={currentImage.url} />
            ) : (
              <div className="text-center p-8 bg-muted rounded-lg">
                Please upload an image to start annotating
              </div>
            )}
          </Suspense>
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-semibold">Version Comparison</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <ImageComparison />
        </Suspense>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">AI Analysis</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <CommentSummary />
        </Suspense>
      </div>
    </div>
  );
}