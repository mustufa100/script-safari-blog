import { describe, it, expect } from 'vitest';
import { validateImage, createMediaPath, MAX_IMAGE_BYTES } from '@/lib/mediaValidation';

describe('media validation', () => {
  it.each([['jpg', 'image/jpeg'], ['jpeg', 'image/jpeg'], ['png', 'image/png'], ['webp', 'image/webp']])('accepts %s images', (ext, type) => {
    expect(validateImage({ name: `photo.${ext}`, type, size: 100 })).toBeNull();
  });
  it('rejects unsupported GIF images', () => {
    expect(validateImage({ name: 'photo.gif', type: 'image/gif', size: 100 })).not.toBeNull();
  });
  it('rejects mismatched file types', () => {
    expect(validateImage({ name: 'photo.png', type: 'text/plain', size: 100 })).not.toBeNull();
  });
  it('enforces the 10 MB limit', () => {
    expect(MAX_IMAGE_BYTES).toBe(10485760);
    expect(validateImage({ name: 'photo.jpg', type: 'image/jpeg', size: 10485760 })).toBeNull();
    expect(validateImage({ name: 'photo.jpg', type: 'image/jpeg', size: 10485761 })).not.toBeNull();
  });
  it('rejects empty files', () => {
    expect(validateImage({ name: 'photo.png', type: 'image/png', size: 0 })).not.toBeNull();
  });
  it('uses separate folders and unique names without overwrites', () => {
    const first = createMediaPath('posts', 'photo.png');
    expect(first).toMatch(/^posts\/[a-f0-9-]+\.png$/);
    expect(createMediaPath('posts', 'photo.png')).not.toBe(first);
    expect(createMediaPath('web-stories', 'photo.webp')).toMatch(/^web-stories\/[a-f0-9-]+\.webp$/);
  });
});