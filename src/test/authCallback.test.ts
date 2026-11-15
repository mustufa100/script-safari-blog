import { beforeEach, describe, expect, it, vi } from 'vitest';

const auth = vi.hoisted(() => ({
  initialize: vi.fn(), verifyOtp: vi.fn(), getUser: vi.fn(),
}));
vi.mock('@/integrations/supabase/client', () => ({ supabase: { auth } }));

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  auth.initialize.mockResolvedValue({ error: null });
  auth.verifyOtp.mockResolvedValue({ error: null });
  auth.getUser.mockResolvedValue({ data: { user: { id: 'verified-user' } }, error: null });
  window.history.replaceState({}, '', '/auth');
});

describe('email callbacks', () => {
  it('verifies a token hash once even with an existing account session', async () => {
    window.history.replaceState({}, '', '/auth?token_hash=verification&type=signup');
    const { completeAuthCallback } = await import('@/lib/authCallback');
    await Promise.all([completeAuthCallback(), completeAuthCallback()]);
    expect(auth.verifyOtp).toHaveBeenCalledExactlyOnceWith({ token_hash: 'verification', type: 'signup' });
  });
  it('uses SDK initialization rather than a second code exchange', async () => {
    window.history.replaceState({}, '', '/auth?code=single-use');
    const { completeAuthCallback } = await import('@/lib/authCallback');
    await completeAuthCallback();
    expect(auth.initialize).toHaveBeenCalledTimes(1);
    expect(auth.verifyOtp).not.toHaveBeenCalled();
  });
  it('rejects expired links even when another user is signed in', async () => {
    window.history.replaceState({}, '', '/auth?token_hash=expired&type=signup');
    auth.verifyOtp.mockResolvedValue({ error: new Error('Token has expired') });
    const { completeAuthCallback } = await import('@/lib/authCallback');
    await expect(completeAuthCallback()).rejects.toThrow('Token has expired');
    expect(auth.getUser).not.toHaveBeenCalled();
  });
  it('verifies password recovery token hashes', async () => {
    window.history.replaceState({}, '', '/reset-password?token_hash=recovery-token&type=recovery');
    const { completeAuthCallback } = await import('@/lib/authCallback');
    await completeAuthCallback();
    expect(auth.verifyOtp).toHaveBeenCalledWith({ token_hash: 'recovery-token', type: 'recovery' });
  });
});