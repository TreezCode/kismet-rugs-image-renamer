import type { Descriptor, ProcessedImage, ValidationResult } from '../types';

/**
 * Validate SKU format
 */
export const validateSKU = (sku: string): ValidationResult => {
  const errors: string[] = [];

  if (!sku || sku.trim() === '') {
    errors.push('SKU is required');
  } else if (!/^[A-Za-z0-9]+$/.test(sku)) {
    errors.push('SKU must be alphanumeric only');
  } else if (sku.length < 4 || sku.length > 10) {
    errors.push('SKU should be 4-10 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Generate filename from SKU, descriptor, and extension
 */
export const generateFilename = (
  sku: string,
  descriptor: Descriptor,
  extension: string
): string => {
  return `${sku}${descriptor}.${extension}`;
};

/**
 * Validate entire batch before processing
 */
export const validateBatch = (
  images: ProcessedImage[],
  sku: string
): ValidationResult => {
  const errors: string[] = [];

  // Validate SKU
  const skuValidation = validateSKU(sku);
  if (!skuValidation.isValid) {
    errors.push(...skuValidation.errors);
  }

  // Check images exist
  if (images.length === 0) {
    errors.push('At least one image is required');
  }

  // Check all descriptors assigned
  const unassigned = images.filter((img) => !img.descriptor);
  if (unassigned.length > 0) {
    errors.push(`${unassigned.length} image(s) need descriptor assigned`);
  }

  // Check for duplicates
  const descriptors = images
    .map((img) => img.descriptor)
    .filter((d): d is Descriptor => d !== null);

  const duplicates = descriptors.filter(
    (d, i) => descriptors.indexOf(d) !== i
  );

  if (duplicates.length > 0) {
    const uniqueDuplicates = [...new Set(duplicates)];
    errors.push(`Duplicate descriptors found: ${uniqueDuplicates.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Check if a descriptor is already used in the image list
 */
export const isDescriptorUsed = (
  descriptor: Descriptor,
  images: ProcessedImage[],
  currentImageId?: string
): boolean => {
  return images.some(
    (img) => img.descriptor === descriptor && img.id !== currentImageId
  );
};
