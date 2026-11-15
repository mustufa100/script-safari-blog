import { beforeEach, describe, expect, it, vi } from 'vitest';
const backend = vi.hoisted(() => ({ getUser: vi.fn(), getSession: vi.fn(), rpc: vi.fn() }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: { auth: backend, rpc: backend.rpc } }));
import { uploadMedia } from '@/lib/mediaUpload';
beforeEach(() => vi.clearAllMocks());
describe('upload authorization', () => {
  it('rejects signed-out visitors before sending file bytes', async () => {
    backend.getUser.mockResolvedValue({ data: { user: null }, error: null });
    await expect(uploadMedia(new File(['image'], 'image.png', { type: 'image/png' }), 'posts', vi.fn())).rejects.toThrow('Please sign in');
    expect(backend.rpc).not.toHaveBeenCalled();
  });
  it('rejects regular users using the server staff check', async () => {
    backend.getUser.mockResolvedValue({ data: { user: { id: 'regular-user' } }, error: null });
    backend.rpc.mockResolvedValue({ data: false, error: null });
    await expect(uploadMedia(new File(['image'], 'image.png', { type: 'image/png' }), 'posts', vi.fn())).rejects.toThrow('Only staff');
    expect(backend.rpc).toHaveBeenCalledWith('is_staff', { _user_id: 'regular-user' });
    expect(backend.getSession).not.toHaveBeenCalled();
  });
});