import imageCompression from 'browser-image-compression';

const DEFAULT_MAX_BYTES = 250 * 1024;

export async function compressImageFile(file: File): Promise<File> {
  const isPng = file.type === 'image/png';
  if (isPng || file.size <= DEFAULT_MAX_BYTES) {
    return file;
  }

  return imageCompression(file, {
    maxSizeMB: 0.3,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
  });
}
