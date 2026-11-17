import imageCompression from 'browser-image-compression';

const DEFAULT_MAX_BYTES = 250 * 1024;

export async function fileToCompressedDataUrl(file: File): Promise<string> {
  const isPng = file.type === 'image/png';
  const compressed =
    !isPng && file.size > DEFAULT_MAX_BYTES
      ? await imageCompression(file, {
          maxSizeMB: 0.3,
          maxWidthOrHeight: 1200,
          useWebWorker: true,
        })
      : file;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(compressed);
  });
}
