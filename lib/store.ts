import { create } from 'zustand';

export interface Annotation {
  id: string;
  x: number;
  y: number;
  comment: string;
  userId: string;
  timestamp: number;
}

export interface ImageVersion {
  id: string;
  url: string;
  timestamp: number;
  annotations: Annotation[];
}

interface AppState {
  images: ImageVersion[];
  currentImageId: string | null;
  addImage: (image: ImageVersion) => void;
  addAnnotation: (imageId: string, annotation: Annotation) => void;
  setCurrentImage: (imageId: string) => void;
}

export const useStore = create<AppState>((set) => ({
  images: [],
  currentImageId: null,
  addImage: (image) =>
    set((state) => ({
      images: [...state.images, image],
    })),
  addAnnotation: (imageId, annotation) =>
    set((state) => ({
      images: state.images.map((img) =>
        img.id === imageId
          ? { ...img, annotations: [...img.annotations, annotation] }
          : img
      ),
    })),
  setCurrentImage: (imageId) =>
    set({
      currentImageId: imageId,
    }),
}));