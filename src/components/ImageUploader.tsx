import React, { useCallback, useRef, useState } from 'react';

interface ImageUploaderProps {
  onImage: (file: File, dataUrl: string) => void;
  hasImage: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImage, hasImage }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);

      // Validation
      const allowed = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowed.includes(file.type)) {
        setError('Please upload a JPG, PNG, or WEBP image.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('File too large — max 10MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        onImage(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    },
    [onImage],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  return (
    <div className="flex flex-col items-center gap-4">
      {!hasImage && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            w-full max-w-md cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition
            ${dragOver
              ? 'border-blue-400 bg-blue-400/10'
              : 'border-neutral-600 bg-neutral-800/50 hover:border-neutral-500'
            }
          `}
        >
          <div className="text-4xl mb-2">🖼️</div>
          <p className="text-neutral-300 font-medium">
            Tap to upload a photo
          </p>
          <p className="text-neutral-500 text-sm mt-1">
            or drag & drop · JPG, PNG, WEBP
          </p>
        </div>
      )}

      {hasImage && (
        <button
          onClick={() => inputRef.current?.click()}
          className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-sm text-neutral-300 transition border border-neutral-700"
        >
          Choose different photo
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
      />

      {error && (
        <p className="text-red-400 text-sm bg-red-400/10 px-4 py-2 rounded-lg">{error}</p>
      )}
    </div>
  );
};

export default ImageUploader;
