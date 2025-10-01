import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { processFiles } from '../services/fileHandler';

export const UploadZone: React.FC = () => {
  const { images, addImages } = useAppStore();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        const processed = await processFiles(acceptedFiles, images.length);
        addImages(processed);
      } catch (error) {
        console.error('Upload error:', error);
        alert(error instanceof Error ? error.message : 'Failed to upload files');
      }
    },
    [images.length, addImages]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    multiple: true,
  });

  return (
    <div className="mb-8">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-brand-orange bg-brand-orange/5 scale-[1.02] shadow-lg'
            : 'border-navy-200 hover:border-brand-orange/50 hover:bg-brand-cream/30'
        }`}
      >
        <input {...getInputProps()} />
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 transition-all ${
          isDragActive ? 'bg-brand-orange/20' : 'bg-navy-100'
        }`}>
          <Upload
            className={`w-10 h-10 transition-colors ${
              isDragActive ? 'text-brand-orange' : 'text-navy-500'
            }`}
          />
        </div>
        <p className="text-lg text-navy-800 font-semibold mb-2">
          {isDragActive ? '📸 Drop images here' : 'Drag & drop images or click to browse'}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium text-brand-orange">JPG, PNG</span> • Max 11 images • Max 50MB per file
        </p>
      </div>
    </div>
  );
};
