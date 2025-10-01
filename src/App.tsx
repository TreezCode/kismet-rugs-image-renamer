import { AlertCircle, Download, Trash2 } from 'lucide-react';
import { useAppStore } from './store/useAppStore';
import { SKUInput } from './components/SKUInput';
import { UploadZone } from './components/UploadZone';
import { ImageGrid } from './components/ImageGrid';
import { Button } from './components/ui/Button';
import { validateBatch } from './services/renameEngine';
import { createZip, downloadZip } from './services/zipGenerator';
import kismetLogo from './assets/brand/kismet_logo_light.webp';

function App() {
  const {
    sku,
    images,
    validationErrors,
    isProcessing,
    setValidationErrors,
    setProcessing,
    clearAll,
  } = useAppStore();

  const handleDownload = async () => {
    const validation = validateBatch(images, sku);

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setProcessing(true);
    setValidationErrors([]);

    try {
      const zipBlob = await createZip(images, sku);
      downloadZip(zipBlob, `${sku}_images.zip`);
      
      // Show success message briefly
      setTimeout(() => {
        alert('ZIP file downloaded successfully!');
      }, 100);
    } catch (error) {
      setValidationErrors(['Failed to create ZIP file. Please try again.']);
      console.error('ZIP creation error:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleClearAll = () => {
    if (images.length > 0) {
      const confirmed = window.confirm(
        'Are you sure you want to clear all images? This action cannot be undone.'
      );
      if (confirmed) {
        clearAll();
      }
    } else {
      clearAll();
    }
  };

  const canDownload = images.length > 0 && sku.trim() !== '' && !isProcessing;

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Brand Header */}
        <div className="mb-6 text-center">
          <img 
            src={kismetLogo} 
            alt="Kismet Fine Rugs" 
            className="h-16 sm:h-20 mx-auto mb-3"
          />
          <div className="inline-block px-4 py-1 bg-brand-orange/20 border border-brand-orange rounded-full">
            <p className="text-orange-400 font-semibold text-sm sm:text-base">
              Photography Tool · Image Batch Renamer
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Decorative header bar */}
          <div className="h-2 bg-gradient-to-r from-brand-orange to-brand-warmOrange"></div>
          
          <div className="p-6 sm:p-8">
            {/* SKU Input */}
            <SKUInput />

            {/* Upload Zone */}
            <UploadZone />
            <ImageGrid />

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-red-800 mb-2">
                      Please fix the following errors:
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                      {validationErrors.map((error, i) => (
                        <li key={i} className="text-sm text-red-700">
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
              <Button
                variant="secondary"
                onClick={handleClearAll}
                disabled={isProcessing}
                className="w-full sm:w-auto"
              >
                <Trash2 className="w-4 h-4 inline mr-2" />
                Clear All
              </Button>
              <Button
                variant="primary"
                onClick={handleDownload}
                disabled={!canDownload}
                className="w-full sm:w-auto"
              >
                {isProcessing ? (
                  <>
                    <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating ZIP...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 inline mr-2" />
                    Download ZIP
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              🔒 All processing happens locally in your browser. Your images never leave your computer.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Kismet Fine Rugs. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
