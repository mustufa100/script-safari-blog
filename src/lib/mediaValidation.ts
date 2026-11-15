export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const IMAGE_ACCEPT = '.jpg,.jpeg,.png,.webp';
export type MediaFolder = 'posts' | 'web-stories' | 'authors' | 'categories';
const extensions: Record<string, string[]> = {
  'image/jpeg': ['jpg', 'jpeg'],
  'image/png': ['png'],
  'image/webp': ['webp'],
};

export function validateImage(file: Pick<File, 'name' | 'type' | 'size'>): string | null {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!extensions[file.type]?.includes(extension)) return 'Choose a JPG, JPEG, PNG or WebP image.';
  if (file.size === 0) return 'This image is empty. Choose another file.';
  if (file.size > MAX_IMAGE_BYTES) return 'Images must be 10 MB or smaller.';
  return null;
}

export function createMediaPath(folder: MediaFolder, fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase() ?? 'jpg';
  return `${folder}/${crypto.randomUUID()}.${extension}`;
}