import JSZip from 'jszip';
import type { ProcessedImage } from '../types';
import { generateFilename } from './renameEngine';

/**
 * Create a ZIP file from processed images
 */
export const createZip = async (
  images: ProcessedImage[],
  sku: string
): Promise<Blob> => {
  const zip = new JSZip();

  for (const img of images) {
    if (!img.descriptor) continue;

    const newFilename = generateFilename(sku, img.descriptor, img.extension);
    zip.file(newFilename, img.file);
  }

  return await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
};

/**
 * Trigger browser download of ZIP file
 */
export const downloadZip = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
