/**
 * Load a File into an HTMLImageElement.
 */
export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image'));
    };
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Read a File as a data URL (for preview display).
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Validate file type and size.
 * Returns null if valid, or an error string if invalid.
 */
export function validateImageFile(file: File, maxSizeMB = 10): string | null {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowed.includes(file.type)) {
    return 'Please upload a JPG, PNG, or WEBP image.';
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return `File too large. Max ${maxSizeMB}MB.`;
  }
  return null;
}
