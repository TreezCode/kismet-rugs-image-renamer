import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Tag } from 'lucide-react';

export const SKUInput: React.FC = () => {
  const { sku, setSKU } = useAppStore();

  return (
    <div className="mb-8">
      <label htmlFor="sku" className="block text-sm font-semibold text-navy-800 mb-2">
        Product SKU <span className="text-brand-orange">*</span>
      </label>
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Tag className="h-5 w-5 text-navy-400" />
        </div>
        <input
          type="text"
          id="sku"
          value={sku}
          onChange={(e) => setSKU(e.target.value)}
          placeholder="Enter SKU (e.g., 63755)"
          className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all"
          maxLength={10}
        />
      </div>
      <p className="mt-2 text-sm text-gray-600 flex items-center gap-1">
        <span className="text-navy-500">ℹ️</span> 4-10 alphanumeric characters
      </p>
    </div>
  );
};
