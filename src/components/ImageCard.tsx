import React from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import type { ProcessedImage, Descriptor } from '../types';
import { DescriptorSelect } from './DescriptorSelect';
import { formatFileSize } from '../services/fileHandler';
import { generateFilename } from '../services/renameEngine';
import { useAppStore } from '../store/useAppStore';

interface ImageCardProps {
  image: ProcessedImage;
}

export const ImageCard: React.FC<ImageCardProps> = ({ image }) => {
  const { images, sku, removeImage, updateDescriptor } = useAppStore();

  const handleDescriptorChange = (descriptor: Descriptor) => {
    updateDescriptor(image.id, descriptor);
  };

  const newFilename = image.descriptor && sku
    ? generateFilename(sku, image.descriptor, image.extension)
    : null;

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:border-brand-orange/30 transition-all duration-300">
      {/* Image Preview */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 aspect-square">
        <img
          src={image.preview}
          alt={image.originalName}
          className="w-full h-full object-contain p-2"
        />
        <button
          onClick={() => removeImage(image.id)}
          className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all shadow-md hover:scale-110"
          title="Remove image"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Image Info */}
      <div className="p-4 space-y-3 bg-white">
        {/* Original filename */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs font-semibold text-navy-600 mb-1">Original:</p>
          <p className="text-sm font-medium text-gray-800 truncate" title={image.originalName}>
            {image.originalName}
          </p>
          <p className="text-xs text-gray-500 mt-1">{formatFileSize(image.size)}</p>
        </div>

        {/* Descriptor select */}
        <div>
          <label className="block text-xs font-semibold text-navy-600 mb-2">Descriptor:</label>
          <DescriptorSelect
            imageId={image.id}
            value={image.descriptor}
            images={images}
            onChange={handleDescriptorChange}
          />
        </div>

        {/* New filename preview */}
        <div className="pt-3 border-t border-gray-200">
          {newFilename ? (
            <div className="flex items-start gap-2 bg-green-50 p-3 rounded-lg">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-green-700 mb-1">New filename:</p>
                <p className="text-sm font-bold text-green-700 truncate" title={newFilename}>
                  {newFilename}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 bg-amber-50 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-amber-700">
                  {!sku ? '⚠️ Enter SKU first' : '⚠️ Select descriptor'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
