import React from 'react';
import type { Descriptor, ProcessedImage } from '../types';
import { DESCRIPTORS, DESCRIPTOR_LABELS } from '../types';
import { isDescriptorUsed } from '../services/renameEngine';

interface DescriptorSelectProps {
  imageId: string;
  value: Descriptor | null;
  images: ProcessedImage[];
  onChange: (descriptor: Descriptor) => void;
}

export const DescriptorSelect: React.FC<DescriptorSelectProps> = ({
  imageId,
  value,
  images,
  onChange,
}) => {
  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value as Descriptor)}
      className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange text-sm font-medium text-navy-700 bg-white hover:border-navy-400 transition-all cursor-pointer"
    >
      <option value="" className="text-gray-500">Select descriptor...</option>
      {DESCRIPTORS.map((descriptor) => {
        const isUsed = isDescriptorUsed(descriptor, images, imageId);
        return (
          <option 
            key={descriptor} 
            value={descriptor} 
            disabled={isUsed}
            className={isUsed ? 'text-gray-400' : 'text-navy-700'}
          >
            {DESCRIPTOR_LABELS[descriptor]} {isUsed ? '✓' : ''}
          </option>
        );
      })}
    </select>
  );
};
