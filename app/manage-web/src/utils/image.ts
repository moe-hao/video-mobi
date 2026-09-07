import Compressor from 'compressorjs';

export function compress(file: File, success: (file: File) => Promise<void>) {
  new Compressor(file, {
    quality: 0.3,
    mimeType: 'image/webp',
    maxWidth: 360,
    maxHeight: 480,
    success: success,
  })
}
