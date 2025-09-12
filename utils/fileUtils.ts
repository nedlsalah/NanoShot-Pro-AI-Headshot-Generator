declare const JSZip: any;

/**
 * Downloads a single image from a data URL.
 * @param dataUrl The data URL of the image (e.g., `data:image/png;base64,...`).
 * @param fileName The name for the downloaded file.
 */
export const downloadImage = (dataUrl: string, fileName: string) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Creates a zip file from multiple base64 encoded images and initiates download.
 * @param images An array of objects, each containing a base64 string and a file name.
 * @param zipFileName The name for the resulting zip file.
 */
export const downloadAllAsZip = async (images: { base64: string, name: string }[], zipFileName: string): Promise<void> => {
  if (typeof JSZip === 'undefined') {
    console.error('JSZip library is not loaded.');
    alert('Could not download all files. The zipping library is missing.');
    return;
  }

  const zip = new JSZip();
  
  images.forEach(image => {
    // JSZip expects the raw base64 data, so we remove the data URL prefix.
    const base64Data = image.base64.split(',')[1] || image.base64;
    zip.file(image.name, base64Data, { base64: true });
  });

  const content = await zip.generateAsync({ type: 'blob' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(content);
  link.download = zipFileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

/**
 * Converts a File object to a base64 string.
 * @param file The file to convert.
 * @returns A promise that resolves with an object containing the base64 data and mime type.
 */
export const fileToBase64 = (file: File): Promise<{ data: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        return reject(new Error('Could not process the uploaded file. It might be corrupted.'));
      }
      const result = reader.result as string;
      const mimeType = result.split(';')[0].split(':')[1];
      const data = result.split(',')[1];
      resolve({ data, mimeType });
    };
    reader.onerror = () => reject(new Error('Failed to read the file. Please try uploading it again.'));
  });
};
