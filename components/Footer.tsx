
import React from 'react';
import { InstagramIcon } from './icons';

export const Footer: React.FC = () => {
  return (
    <footer className="text-center py-6">
      <div className="text-sm text-slate-500 dark:text-slate-400">
        <span>Created by nedlsalah</span>
        <a 
          href="https://instagram.com/nedlsalah/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center ml-2 text-blue-500 hover:underline"
        >
          <InstagramIcon className="w-4 h-4 mr-1" />
          <span>nedlsalah</span>
        </a>
      </div>
    </footer>
  );
};
