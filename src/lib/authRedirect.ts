export const PRODUCTION_ORIGIN = 'https://scriptsafari.com';
const PRODUCTION_HOSTS = ['scriptsafari.com', 'www.scriptsafari.com'];

/** Where auth emails should send people back to. Production always uses the canonical domain. */
export function getAuthRedirectUrl(path: string, origin: string = window.location.origin): string {
  const host = new URL(origin).hostname;
  const base = PRODUCTION_HOSTS.includes(host) ? PRODUCTION_ORIGIN : origin;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export type AuthCallback = {
  error: string | null;
  code: string | null;
  tokenHash: string | null;
  type: string | null;
  hasSessionTokens: boolean;
};

/** Reads Supabase callback values from both the query string and the hash. */
export function parseAuthCallback(search: string, hash: string): AuthCallback {
  const q = new URLSearchParams(search);
  const h = new URLSearchParams(hash.replace(/^#/, ''));
  const get = (k: string) => q.get(k) ?? h.get(k);
  const err = get('error_description') ?? get('error');
  return {
    error: err ? err.replace(/\+/g, ' ') : null,
    code: q.get('code'),
    tokenHash: get('token_hash'),
    type: get('type'),
    hasSessionTokens: h.has('access_token'),
  };
}
