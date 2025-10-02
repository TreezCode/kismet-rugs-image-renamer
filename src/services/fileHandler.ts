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
 * Extract embedded JPEG preview from ARW file
 * Sony ARW files contain multiple embedded JPEGs - this function extracts the largest valid one
 * and resizes it for display as a preview thumbnail
 */
const extractArwThumbnail = async (file: File): Promise<string | null> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    
    // Find all embedded JPEGs in the ARW file by scanning for JPEG markers
    const jpegs: { start: number; end: number; size: number }[] = [];
    
    for (let i = 0; i < bytes.length - 1; i++) {
      // JPEG start marker: 0xFFD8
      if (bytes[i] === 0xFF && bytes[i + 1] === 0xD8) {
        const startIndex = i;
        
        // Find corresponding end marker: 0xFFD9
        for (let j = startIndex + 2; j < bytes.length - 1; j++) {
          if (bytes[j] === 0xFF && bytes[j + 1] === 0xD9) {
            const endIndex = j + 2;
            jpegs.push({
              start: startIndex,
              end: endIndex,
              size: endIndex - startIndex
            });
            i = endIndex; // Skip past this JPEG to find the next one
            break;
          }
        }
      }
    }
    
    if (jpegs.length === 0) {
      return null;
    }
    
    // Sort JPEGs by size (largest first) and try each until we find a valid one
    const sortedJpegs = [...jpegs].sort((a, b) => b.size - a.size);
    
    // Recursively try each JPEG until we find one that loads successfully
    const tryJpeg = async (index: number): Promise<string> => {
      if (index >= sortedJpegs.length) {
        throw new Error('No valid embedded JPEGs found');
      }
      
      const jpeg = sortedJpegs[index];
      const jpegBytes = bytes.slice(jpeg.start, jpeg.end);
      const blob = new Blob([jpegBytes], { type: 'image/jpeg' });
      const blobUrl = URL.createObjectURL(blob);
      
      return new Promise<string>((resolve, reject) => {
        const img = new Image();
        
        img.onload = () => {
          URL.revokeObjectURL(blobUrl);
          
          // Create resized preview (200px width)
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
          }
          
          const scale = 200 / img.width;
          canvas.width = 200;
          canvas.height = img.height * scale;
          
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        
        img.onerror = async () => {
          URL.revokeObjectURL(blobUrl);
          
          // This JPEG failed, try the next one
          try {
            const result = await tryJpeg(index + 1);
            resolve(result);
          } catch (err) {
            reject(err);
          }
        };
        
        img.src = blobUrl;
      });
    };
    
    return tryJpeg(0);
    
  } catch (error) {
    console.error('ARW preview extraction failed:', error);
    return null;
  }
};

/**
 * Generate a thumbnail preview from an image file
 * For ARW files: extracts embedded JPEG and creates preview
 * For JPG/PNG: creates standard thumbnail preview
 */
export const generatePreview = (file: File): Promise<string> => {
  const isArw = file.name.toLowerCase().endsWith('.arw');
  
  if (isArw) {
    // Extract embedded JPEG from ARW file
    return extractArwThumbnail(file).then((thumbnail) => {
      if (thumbnail) {
        return thumbnail;
      }
      
      // Fallback placeholder if no valid JPEG found
      const svg = `
        <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="#f3f4f6"/>
          <circle cx="100" cy="80" r="30" fill="#9b1a37"/>
          <circle cx="100" cy="80" r="20" fill="#ef4444"/>
          <rect x="70" y="75" width="60" height="10" rx="5" fill="#fff" opacity="0.3"/>
          <text x="100" y="140" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#374151">
            ARW FILE
          </text>
          <text x="100" y="160" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#6b7280">
            No Preview Available
          </text>
        </svg>
      `;
      return `data:image/svg+xml;base64,${btoa(svg)}`;
    });
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
