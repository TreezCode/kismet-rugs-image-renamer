import type { ProcessedImage, ValidationResult } from '../types';

const MAX_FILES = 11;
const MAX_SIZE = 50 * 1024 * 1024; // 50MB
const VALID_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

/**
 * Validate a single file
 */
export const validateFile = (file: File): ValidationResult => {
  const errors: string[] = [];

  if (!VALID_TYPES.includes(file.type)) {
    errors.push(`${file.name}: Invalid file type. Use JPG or PNG`);
  }

  if (file.size > MAX_SIZE) {
    errors.push(`${file.name}: File too large (max 50MB)`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Generate a thumbnail preview from an image file
 */
export const generatePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // Resize to 200px width maintaining aspect ratio
        const scale = 200 / img.width;
        canvas.width = 200;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Process multiple files into ProcessedImage objects
 */
export const processFiles = async (
  files: File[],
  existingCount: number
): Promise<ProcessedImage[]> => {
  if (existingCount + files.length > MAX_FILES) {
    throw new Error(`Maximum ${MAX_FILES} images allowed`);
  }

  const processed: ProcessedImage[] = [];

  for (const file of files) {
    const validation = validateFile(file);

    if (!validation.isValid) {
      console.error(validation.errors.join(', '));
      continue;
    }

    try {
      const preview = await generatePreview(file);
      const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';

      processed.push({
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        file,
        originalName: file.name,
        preview,
        descriptor: null,
        extension,
        size: file.size,
      });
    } catch (error) {
      console.error(`Failed to process ${file.name}:`, error);
    }
  }

  return processed;
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
