
import React, { useState } from 'react';
import { ImageCard } from './ImageCard';
import { downloadAllAsZip } from '../utils/fileUtils';

interface GalleryProps {
  images: string[];
}

export const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  const handleDownloadAll = async () => {
    setIsDownloadingAll(true);
    const imageObjects = images.map((base64, index) => ({
        base64,
        name: `headshot_${index + 1}.png`
    }));
    await downloadAllAsZip(imageObjects, 'nanoshot-pro-headshots.zip');
    setIsDownloadingAll(false);
  };

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {images.map((img, index) => (
          <ImageCard key={index} base64Image={img} fileName={`headshot_${index + 1}.png`} />
        ))}
      </div>
      <div className="mt-8 text-center">
        <button
          onClick={handleDownloadAll}
          disabled={isDownloadingAll}
          className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed dark:disabled:bg-slate-600 transition-all duration-300"
        >
          {isDownloadingAll ? 'Zipping...' : 'Download All'}
        </button>
      </div>
    </div>
  );
};
