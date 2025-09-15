import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { Gallery } from './components/Gallery';
import { Footer } from './components/Footer';
import { generateHeadshot } from './services/geminiService';
import { stylePresets } from './constants';
import { fileToBase64 } from './utils/fileUtils';

export interface GeneratedImage {
  prompt: string;
  image: string | null;
  status: 'loading' | 'success' | 'error';
  errorMessage?: string;
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
    setProgress(0);
    
    const shuffle = <T,>(array: T[]): T[] => {
      const newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    };
    
    const corporatePrompts = shuffle(stylePresets.find(p => p.id === 'corporate')?.prompts || []).slice(0, 4);
    const modernPrompts = shuffle(stylePresets.find(p => p.id === 'modern')?.prompts || []).slice(0, 4);
    const classicPrompts = shuffle(stylePresets.find(p => p.id === 'classic')?.prompts || []).slice(0, 3);
    
    const mixedPrompts = [...corporatePrompts, ...modernPrompts, ...classicPrompts];
    const headshotPrompts = shuffle(mixedPrompts);


    const initialImages: GeneratedImage[] = headshotPrompts.map(prompt => ({
      prompt,
      image: null,
      status: 'loading',
    }));
    setGeneratedImages(initialImages);


    try {
      const { data: base64ImageData, mimeType } = await fileToBase64(uploadedFile);
      
      const totalPrompts = headshotPrompts.length;
      let completedCount = 0;
      const CONCURRENCY_LIMIT = 5;

      for (let i = 0; i < totalPrompts; i += CONCURRENCY_LIMIT) {
        const chunk = headshotPrompts.slice(i, i + CONCURRENCY_LIMIT);
        
        const promises = chunk.map(prompt => 
          generateHeadshot(prompt, base64ImageData, mimeType)
            .then(image => ({ prompt, image, status: 'success' as const }))
            .catch(err => ({ prompt, image: null, status: 'error' as const, errorMessage: err.message }))
        );

        const results = await Promise.all(promises);
        
        setGeneratedImages(prevImages => {
          const updatedImages = [...prevImages];
          results.forEach(result => {
            const index = updatedImages.findIndex(p => p.prompt === result.prompt);
            if (index !== -1) {
              updatedImages[index] = { ...updatedImages[index], ...result };
            }
          });
          return updatedImages;
        });
        
        completedCount += chunk.length;
        setProgress(Math.round((completedCount / totalPrompts) * 100));
      }

    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please refresh and try again.");
      }
      setGeneratedImages([]);
    } finally {
      setIsLoading(false);
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
          
          {isLoading || generatedImages.length > 0 ? (
             <div className="mt-12">
                <Gallery
                  images={generatedImages}
                  onStartOver={handleStartOver}
                  isLoading={isLoading}
                  progress={progress}
                  loadingMessage={loadingMessage}
                />
             </div>
          ) : (
            <div className="flex flex-col items-center gap-8 md:gap-12">
              <div className="flex flex-col items-center w-full max-w-sm">
                 <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200">Step 1: Upload Your Photo</h3>
                <UploadZone onFileSelect={handleFileSelect} uploadedFile={uploadedFile} disabled={isLoading} />
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-3 text-center">
                  For best results, use a clear, front-facing photo.
                  <br />
                  Accepted formats: JPG, PNG, WEBP. Max size: 5MB
                </p>
              </div>
              
              <div className="w-full max-w-sm flex flex-col items-center">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Step 2: Generate</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-4 text-center">
                    We'll generate a fantastic mix of professional styles for you.
                </p>
                <div className="w-full flex flex-col space-y-3">
                  <button
                    onClick={handleGenerateHeadshots}
                    disabled={!uploadedFile || isLoading}
                    className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed dark:disabled:bg-slate-600 transition-all duration-300 flex items-center justify-center"
                    aria-label="Generate a mix of headshots"
                  >
                     {isLoading ? 'Generating...' : 'Generate Headshots'}
                  </button>
                  {uploadedFile && (
                    <button
                      onClick={handleStartOver}
                      className="w-full bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 font-semibold py-3 px-6 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                    >
                      Start Over
                    </button>
                  )}
                </div>
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