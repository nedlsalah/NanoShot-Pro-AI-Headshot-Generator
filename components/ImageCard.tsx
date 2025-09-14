import React from 'react';
import { downloadImage } from '../utils/fileUtils';
import { DownloadIcon, ErrorIcon } from './icons';

interface ImageCardProps {
  image: string | null;
  status: 'loading' | 'success' | 'error';
  fileName: string;
  prompt: string;
}

export const ImageCard: React.FC<ImageCardProps> = ({ image, status, fileName, prompt }) => {
  const handleDownload = () => {
    if (image) {
      downloadImage(`data:image/png;base64,${image}`, fileName);
    }
  };

  return (
    <div className="group relative aspect-square overflow-hidden rounded-lg shadow-lg bg-slate-200 dark:bg-slate-700" title={prompt}>
      {status === 'loading' && (
        <div className="h-full w-full animate-pulse bg-slate-300 dark:bg-slate-600"></div>
      )}

      {status === 'error' && (
        <div className="h-full w-full flex flex-col items-center justify-center text-red-500 dark:text-red-400 p-2">
          <ErrorIcon className="w-10 h-10" />
          <p className="text-xs mt-2 text-center font-semibold">Generation Failed</p>
        </div>
      )}

      {status === 'success' && image && (
        <>
          <img
            src={`data:image/png;base64,${image}`}
            alt={fileName}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              onClick={handleDownload}
              className="bg-white/20 backdrop-blur-sm p-3 rounded-full text-white hover:bg-white/30 transition-colors"
              aria-label="Download image"
            >
              <DownloadIcon className="w-6 h-6" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};