import React, { useState } from 'react';
import { ImageCard } from './ImageCard';
import { downloadAllAsZip } from '../utils/fileUtils';

interface GalleryProps {
  images: {
    prompt: string;
    image: string;
  }[];
  onStartOver: () => void;
}

export const Gallery: React.FC<GalleryProps> = ({ images, onStartOver }) => {
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  const handleDownloadAll = async () => {
    setIsDownloadingAll(true);
    const imageObjects = images.map((item, index) => ({
        base64: item.image,
        name: `headshot_${index + 1}.png`
    }));
    await downloadAllAsZip(imageObjects, 'nanoshot-pro-headshots.zip');
    setIsDownloadingAll(false);
  };

  return (
    <div>
       <div className="mb-8 flex flex-col sm:flex-row justify-center items-center gap-4">
        <button
          onClick={handleDownloadAll}
          disabled={isDownloadingAll}
          className="w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed dark:disabled:bg-slate-600 transition-all duration-300"
        >
          {isDownloadingAll ? 'Zipping...' : 'Download All'}
        </button>
        <button
          onClick={onStartOver}
          className="w-full sm:w-auto bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 font-semibold py-3 px-8 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
          Start Over
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {images.map((item, index) => (
          <ImageCard
            key={index}
            base64Image={item.image}
            fileName={`headshot_${index + 1}.png`}
            prompt={item.prompt}
          />
        ))}
      </div>
    </div>
  );
};