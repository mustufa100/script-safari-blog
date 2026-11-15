import type { EmailOtpType } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { parseAuthCallback } from '@/lib/authRedirect';

// Capture before the SDK consumes and clears implicit/PKCE callback values.
export const initialAuthCallback = parseAuthCallback(window.location.search, window.location.hash);
const otpTypes = ['signup', 'invite', 'magiclink', 'recovery', 'email_change', 'email'];
let pending: Promise<void> | undefined;

export function completeAuthCallback(): Promise<void> {
  if (!pending) pending = resolveCallback();
  return pending;
}

async function resolveCallback() {
  const callback = initialAuthCallback;
  if (callback.error) throw new Error(callback.error);
  if (callback.tokenHash) {
    if (!callback.type || !otpTypes.includes(callback.type)) throw new Error('This email link is invalid. Request a new one.');
    // Verify even if another account is signed in; never mistake its session for this link.
    const { error } = await supabase.auth.verifyOtp({ token_hash: callback.tokenHash, type: callback.type as EmailOtpType });
    if (error) throw error;
  } else {
    // Initialization owns code/hash exchange. Exchanging again consumes single-use codes twice.
    const { error } = await supabase.auth.initialize();
    if (error) throw error;
  }
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error(error?.message ?? 'This email link is invalid or has expired. Request a new one.');
}