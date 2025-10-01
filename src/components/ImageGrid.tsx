import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { ImageCard } from './ImageCard';

export const ImageGrid: React.FC = () => {
  const { images } = useAppStore();

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-navy-800">
          📸 Uploaded Images
        </h3>
        <span className="inline-flex items-center px-3 py-1 bg-brand-orange/10 border border-brand-orange/30 rounded-full">
          <span className="text-sm font-semibold text-brand-orange">
            {images.length} / 11
          </span>
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {images.map((image) => (
          <ImageCard key={image.id} image={image} />
        ))}
      </div>
    </div>
  );
};
