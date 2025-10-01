// Descriptor types for image naming
export type Descriptor =
  | 'front'
  | 'diag1'
  | 'rear'
  | 'diag2'
  | 'zoom1'
  | 'zoom2'
  | 'folded'
  | 'tape'
  | 'tag'
  | 'thickness'
  | 'topdown';

// Processed image with metadata
export interface ProcessedImage {
  id: string;
  file: File;
  originalName: string;
  preview: string;
  descriptor: Descriptor | null;
  extension: string;
  size: number;
}

// Validation result structure
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// All available descriptors as a constant array
export const DESCRIPTORS: Descriptor[] = [
  'front',
  'diag1',
  'rear',
  'diag2',
  'zoom1',
  'zoom2',
  'folded',
  'tape',
  'tag',
  'thickness',
  'topdown',
];

// Descriptor display labels
export const DESCRIPTOR_LABELS: Record<Descriptor, string> = {
  front: 'Front View',
  diag1: 'Diagonal 1',
  rear: 'Rear View',
  diag2: 'Diagonal 2',
  zoom1: 'Detail Zoom 1',
  zoom2: 'Detail Zoom 2',
  folded: 'Folded View',
  tape: 'Measuring Tape',
  tag: 'Tag/Label',
  thickness: 'Pile Thickness',
  topdown: 'Top-Down View',
};
