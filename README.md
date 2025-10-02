# Kismet Fine Rugs - Image Batch Renamer

A professional, custom-built web application for batch renaming rug product images with SKU-based naming conventions.

## 🎯 Purpose

Built exclusively for **Kismet Fine Rugs** to streamline their photography workflow for 12,000+ rugs. This enterprise-grade tool enables photographers to efficiently rename camera files (IMG_2045.jpg) to SKU-based filenames (63755front.jpg) through an elegant, branded interface.

## ✨ Features

- 🎨 **Custom Branded Interface**: Kismet Fine Rugs navy & orange color scheme with logo
- 📸 **Intuitive Drag & Drop**: Upload 1-11 images per rug with visual feedback
- 🏷️ **Smart SKU Input**: Alphanumeric validation with helpful hints
- 📋 **11 Descriptors**: front, diag1, rear, diag2, zoom1, zoom2, folded, tape, tag, thickness, topdown
- 🔒 **Duplicate Prevention**: Used descriptors automatically disabled
- ✅ **Real-time Preview**: See new filenames before downloading
- 📦 **ZIP Download**: Get all renamed images in a single, organized ZIP file
- 🔐 **100% Private**: All processing happens locally in your browser
- 🚀 **Zero Installation**: Works offline as a single, self-contained HTML file
- 📱 **Responsive Design**: Works flawlessly on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **React 18** - Modern component-based UI architecture
- **TypeScript 5** - Type-safe development with full IntelliSense
- **Vite 5** - Lightning-fast build tool with HMR
- **Tailwind CSS 4** - Custom branded styling with Kismet colors
- **Zustand** - Lightweight, efficient state management
- **React Dropzone** - Enhanced drag & drop UX
- **JSZip** - Client-side ZIP file creation
- **Lucide React** - Beautiful, consistent icons
- **Vitest** - Comprehensive unit testing

## 🚀 Development

### Prerequisites

- Node.js 18+ and npm

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

### Development Server

The app will run at `http://localhost:5173`

## 📦 Build

```bash
npm run build
```

This creates a single `dist/index.html` file (~500KB) that can be:
- Emailed to users
- Hosted on any web server
- Run locally by double-clicking

## 🎨 Usage

1. **Open the tool**: Double-click `index.html` or visit the hosted URL
2. **Enter SKU**: Type your product SKU (e.g., 63755)
3. **Upload images**: Drag & drop or click to browse
4. **Assign descriptors**: Select descriptor for each image
5. **Download**: Click "Download ZIP" to get renamed images

## 📝 Output Format

```
Input:  IMG_2045.jpg, IMG_2046.jpg, IMG_2047.jpg
SKU:    63755
Output: 63755front.jpg, 63755diag1.jpg, 63755rear.jpg
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## 📄 License

Proprietary - Built for Kismet Fine Rugs

## 👤 Author

TreezCode

## 📧 Support

For issues or questions, contact: treezcode@gmail.com
