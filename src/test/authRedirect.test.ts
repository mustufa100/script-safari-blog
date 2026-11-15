import { describe, it, expect } from 'vitest';
import { getAuthRedirectUrl, parseAuthCallback } from '@/lib/authRedirect';

describe('auth redirects', () => {
  it('sends production confirmations to scriptsafari.com/auth', () => {
    expect(getAuthRedirectUrl('/auth', 'https://scriptsafari.com')).toBe('https://scriptsafari.com/auth');
    expect(getAuthRedirectUrl('/auth', 'https://www.scriptsafari.com')).toBe('https://scriptsafari.com/auth');
  });
  it('keeps local development on its own origin', () => {
    expect(getAuthRedirectUrl('/auth', 'http://localhost:8080')).toBe('http://localhost:8080/auth');
  });
  it('sends production recovery to the canonical reset-password page', () => {
    expect(getAuthRedirectUrl('/reset-password', 'https://www.scriptsafari.com')).toBe('https://scriptsafari.com/reset-password');
  });
  it('keeps preview confirmations separate from production', () => {
    expect(getAuthRedirectUrl('/auth', 'https://preview--script-safari-essence.lovable.app')).toBe('https://preview--script-safari-essence.lovable.app/auth');
  });
  it('reads recovery tokens and verification token hashes', () => {
    expect(parseAuthCallback('', '#access_token=test&type=recovery')).toMatchObject({ hasSessionTokens: true, type: 'recovery' });
    expect(parseAuthCallback('?token_hash=test&type=signup', '')).toMatchObject({ tokenHash: 'test', type: 'signup' });
  });
  it('reads link errors from the hash', () => {
    expect(parseAuthCallback('', '#error=access_denied&error_description=Email+link+is+invalid').error).toBe('Email link is invalid');
  });
});
