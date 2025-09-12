import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { Gallery } from './components/Gallery';
import { Footer } from './components/Footer';
import { generateHeadshot } from './services/geminiService';
import { headshotPrompts } from './constants';
import { fileToBase64 } from './utils/fileUtils';

const App: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

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
      const newImages: string[] = [];

      for (let i = 0; i < totalPrompts; i++) {
        const prompt = headshotPrompts[i];
        const base64Image = await generateHeadshot(prompt, base64ImageData, mimeType);
        newImages.push(base64Image);
        // Update state with a new array to ensure re-render
        setGeneratedImages([...newImages]);
        setProgress(Math.round(((i + 1) / totalPrompts) * 100));
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
                    <span>Processing... {progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mt-2">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.3s ease-in-out' }}></div>
                  </div>
                </div>
              )}
              {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
            </div>
          </div>
          
          {generatedImages.length > 0 && (
            <div className="mt-12">
              <Gallery images={generatedImages} />
              <div className="text-center mt-8">
                <button
                  onClick={handleStartOver}
                  className="bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 font-semibold py-2 px-6 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  Start Over
                </button>
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
