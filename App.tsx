import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { Gallery } from './components/Gallery';
import { Footer } from './components/Footer';
import { generateHeadshot } from './services/geminiService';
import { headshotPrompts } from './constants';
import { fileToBase64 } from './utils/fileUtils';

interface GeneratedImage {
  prompt: string;
  image: string;
}

const App: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  useEffect(() => {
    if (!isLoading) return;

    const messages = [
      'Analyzing photo structure...',
      'Identifying key features...',
      'Generating professional backgrounds...',
      'Adjusting lighting and attire...',
      'Rendering high-resolution portraits...',
      'Finalizing your headshots...',
    ];
    let currentIndex = 0;
    setLoadingMessage(messages[currentIndex]);

    const intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % messages.length;
      setLoadingMessage(messages[currentIndex]);
    }, 2500);

    return () => {
      clearInterval(intervalId);
    };
  }, [isLoading]);

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
    setError(null);
    setGeneratedImages([]);
  };

  const handleGenerateHeadshots = useCallback(async () => {
    if (!uploadedFile) {
      setError("Please upload a photo first.");
      return;
    }

    if (!navigator.onLine) {
        setError("You appear to be offline. Please check your internet connection.");
        return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);
    setProgress(0);

    try {
      const { data: base64ImageData, mimeType } = await fileToBase64(uploadedFile);
      
      const totalPrompts = headshotPrompts.length;
      let generatedCount = 0;
      const CONCURRENCY_LIMIT = 5; // Process 5 images at a time for speed

      for (let i = 0; i < totalPrompts; i += CONCURRENCY_LIMIT) {
        const chunk = headshotPrompts.slice(i, i + CONCURRENCY_LIMIT);
        
        const promises = chunk.map(prompt => 
          generateHeadshot(prompt, base64ImageData, mimeType).catch(err => {
            console.error(`Failed to generate headshot for prompt: "${prompt}"`, err);
            return null; // Return null on failure to not break Promise.all
          })
        );

        const results = await Promise.all(promises);
        
        const newImages = results
          .map((img, index) => ({
            prompt: chunk[index],
            image: img,
          }))
          .filter((item): item is GeneratedImage => item.image !== null);
        
        if (newImages.length > 0) {
          setGeneratedImages(prev => [...prev, ...newImages]);
        }
        
        generatedCount += chunk.length;
        setProgress(Math.round((generatedCount / totalPrompts) * 100));
      }

    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please refresh and try again.");
      }
    } finally {
      setIsLoading(false);
      setProgress(100);
    }
  }, [uploadedFile]);

  const handleStartOver = () => {
    setUploadedFile(null);
    setGeneratedImages([]);
    setIsLoading(false);
    setProgress(0);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-300 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 md:p-10 border border-slate-200 dark:border-slate-700">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">NanoShot Pro</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
              Transform your photo into professional headshots instantly
            </p>
          </div>
          
          {generatedImages.length > 0 ? (
             <div className="mt-12">
                <Gallery images={generatedImages} onStartOver={handleStartOver} />
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="flex flex-col items-center">
                <UploadZone onFileSelect={handleFileSelect} uploadedFile={uploadedFile} disabled={isLoading} />
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Accepted formats: JPG, PNG, WEBP. Max size: 5MB</p>
              </div>
              
              <div className="flex flex-col justify-center items-center h-full space-y-4 pt-4 md:pt-0">
                <button
                  onClick={handleGenerateHeadshots}
                  disabled={!uploadedFile || isLoading}
                  className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed dark:disabled:bg-slate-600 transition-all duration-300"
                >
                  Generate Headshots
                </button>

                {isLoading && (
                  <div className="w-full text-center">
                    <div className="flex items-center justify-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                      <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>{loadingMessage}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mt-2">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.3s ease-in-out' }}></div>
                    </div>
                  </div>
                )}
                {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;