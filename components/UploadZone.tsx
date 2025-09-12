
import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon } from './icons';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  uploadedFile: File | null;
  disabled: boolean;
}

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect, uploadedFile, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (disabled) return;
    setError(null);
    if (!ACCEPTED_FORMATS.includes(file.type)) {
      setError('Invalid file type. Please use JPG, PNG, or WEBP.');
      return;
    }
    if (file.size > MAX_SIZE) {
      setError('File is too large. Max size is 5MB.');
      return;
    }
    onFileSelect(file);
  }, [onFileSelect, disabled]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const dragDropClasses = isDragging
    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
    : 'border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500';

  return (
    <div className="w-full max-w-sm">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${dragDropClasses} ${disabled ? 'cursor-not-allowed bg-slate-100 dark:bg-slate-700/50' : ''}`}
      >
        {uploadedFile && !error ? (
          <img src={URL.createObjectURL(uploadedFile)} alt="Preview" className="h-full w-full object-cover rounded-lg"/>
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
            <UploadIcon className="w-10 h-10 mb-3 text-slate-400" />
            <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="font-semibold">Drag & drop your photo here</span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">or</p>
            <button
              type="button"
              onClick={handleBrowseClick}
              disabled={disabled}
              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Browse
            </button>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          accept={ACCEPTED_FORMATS.join(',')}
          disabled={disabled}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
    </div>
  );
};
