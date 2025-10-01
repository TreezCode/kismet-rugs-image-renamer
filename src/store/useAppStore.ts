import { create } from 'zustand';
import type { Descriptor, ProcessedImage } from '../types';

interface AppState {
  // State
  sku: string;
  images: ProcessedImage[];
  validationErrors: string[];
  isProcessing: boolean;

  // Actions
  setSKU: (sku: string) => void;
  addImages: (images: ProcessedImage[]) => void;
  removeImage: (id: string) => void;
  updateDescriptor: (id: string, descriptor: Descriptor) => void;
  setValidationErrors: (errors: string[]) => void;
  setProcessing: (isProcessing: boolean) => void;
  clearAll: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  sku: '',
  images: [],
  validationErrors: [],
  isProcessing: false,

  // Actions
  setSKU: (sku) => set({ sku: sku.trim() }),

  addImages: (newImages) =>
    set((state) => ({ images: [...state.images, ...newImages] })),

  removeImage: (id) =>
    set((state) => ({
      images: state.images.filter((img) => img.id !== id),
    })),

  updateDescriptor: (id, descriptor) =>
    set((state) => ({
      images: state.images.map((img) =>
        img.id === id ? { ...img, descriptor } : img
      ),
    })),

  setValidationErrors: (errors) => set({ validationErrors: errors }),

  setProcessing: (isProcessing) => set({ isProcessing }),

  clearAll: () =>
    set({ sku: '', images: [], validationErrors: [], isProcessing: false }),
}));
