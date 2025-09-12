
import React from 'react';
import { downloadImage } from '../utils/fileUtils';
import { DownloadIcon } from './icons';

interface ImageCardProps {
  base64Image: string;
  fileName: string;
}

export const ImageCard: React.FC<ImageCardProps> = ({ base64Image, fileName }) => {
  const handleDownload = () => {
    downloadImage(`data:image/png;base64,${base64Image}`, fileName);
  };

  return (
    <div className="group relative aspect-square overflow-hidden rounded-lg shadow-lg">
      <img
        src={`data:image/png;base64,${base64Image}`}
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
    </div>
  );
};
