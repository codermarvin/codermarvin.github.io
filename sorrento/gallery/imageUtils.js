/**
 * Utility function to compress images in-browser using HTML5 Canvas.
 * Reduces dimension if it exceeds maximum size, and compresses as JPEG.
 * 
 * @param {File} file The original image file
 * @param {number} maxWidth The maximum allowed width
 * @param {number} maxHeight The maximum allowed height
 * @param {number} quality Compression quality between 0.0 and 1.0
 * @returns {Promise<{ base64: string, name: string, originalSize: number, compressedSize: number }>}
 */
export function compressImage(file, maxWidth = 1600, maxHeight = 1600, quality = 0.8) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Export to JPEG base64 string
        const base64 = canvas.toDataURL('image/jpeg', quality);
        
        // Calculate sizes
        const originalSize = file.size;
        // Approx size of base64 data in bytes (excluding headers) is length * 0.75
        const base64Length = base64.split(',')[1].length;
        const compressedSize = Math.round(base64Length * 0.75);
        
        resolve({
          base64,
          name: file.name.replace(/\.[^/.]+$/, '') + '.jpg', // Convert extension to .jpg
          originalSize,
          compressedSize
        });
      };
      
      img.onerror = (err) => {
        reject(new Error('Failed to load image: ' + err));
      };
    };
    
    reader.onerror = (err) => {
      reject(new Error('Failed to read file: ' + err));
    };
  });
}

/**
 * Format bytes to a human-readable string.
 * @param {number} bytes 
 * @returns {string}
 */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
