import type { ProcessedImage, ValidationResult } from '../types';

const MAX_FILES = 11;
const MAX_SIZE = 50 * 1024 * 1024; // 50MB
const VALID_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/x-sony-arw', 'image/arw'];

/**
 * Validate a single file
 */
export const validateFile = (file: File): ValidationResult => {
  const errors: string[] = [];

  // Check file type - also check extension for ARW files (browsers may not recognize MIME type)
  const isValidType = VALID_TYPES.includes(file.type) || file.name.toLowerCase().endsWith('.arw');
  
  if (!isValidType) {
    errors.push(`${file.name}: Invalid file type. Use JPG, PNG, or ARW`);
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
 * For ARW files, returns a placeholder icon since browsers can't render RAW
 */
export const generatePreview = (file: File): Promise<string> => {
  // Check if it's an ARW file - use placeholder preview
  const isArw = file.name.toLowerCase().endsWith('.arw');
  
  if (isArw) {
    // Return a placeholder icon for ARW files (RAW format not supported by browsers)
    return Promise.resolve('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNTBDNzQuNjI0NCA1MCA1NCA3MC42MjQ0IDU0IDk2QzU0IDEyMS4zNzYgNzQuNjI0NCAxNDIgMTAwIDE0MkMxMjUuMzc2IDE0MiAxNDYgMTIxLjM3NiAxNDYgOTZDMTQ2IDcwLjYyNDQgMTI1LjM3NiA1MCAxMDAgNTBaIiBmaWxsPSIjOUIxQTM3Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBDODUuNjQzNiA3MCA3NCA4MS42NDM2IDc0IDk2Qzc0IDExMC4zNTYgODUuNjQzNiAxMjIgMTAwIDEyMkMxMTQuMzU2IDEyMiAxMjYgMTEwLjM1NiAxMjYgOTZDMTI2IDgxLjY0MzYgMTE0LjM1NiA3MCAxMDAgNzBaIiBmaWxsPSIjRUY0NDQ0Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTcwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2QjcyODAiIGZvbnQtd2VpZ2h0PSI2MDAiPkFSVyBGaWxlPC90ZXh0Pgo8L3N2Zz4=');
  }
  
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
