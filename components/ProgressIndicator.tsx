import React from 'react';

interface ProgressIndicatorProps {
  progress: number;
  message: string;
  generatedCount: number;
  total: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ progress, message, generatedCount, total }) => {
  return (
    <div className="w-full max-w-2xl mx-auto text-center mb-8 p-6 bg-slate-100 dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700" role="status" aria-live="polite">
      <div className="flex items-center justify-center space-x-2 text-lg font-semibold text-slate-700 dark:text-slate-300">
        <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Generating your headshots...</span>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{message}</p>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mt-4" aria-label="Generation progress">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${progress}%`, transition: 'width 0.3s ease-in-out' }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        ></div>
      </div>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-2">
        {generatedCount} / {total} Completed ({progress}%)
      </p>
    </div>
  );
};