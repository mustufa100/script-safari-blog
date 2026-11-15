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
  it('reads link errors from the hash', () => {
    expect(parseAuthCallback('', '#error=access_denied&error_description=Email+link+is+invalid').error).toBe('Email link is invalid');
  });
});
