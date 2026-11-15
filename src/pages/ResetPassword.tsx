import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { EmailOtpType } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { parseAuthCallback } from '@/lib/authRedirect';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [ready, setReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    const prepareRecovery = async () => {
      const callback = parseAuthCallback(window.location.search, window.location.hash);
      if (callback.error) {
        if (active) setErrorMessage(callback.error);
        return;
      }
      const recoveryLink = callback.type === 'recovery' || callback.hasSessionTokens || Boolean(callback.code);
      if (!recoveryLink) {
        if (active) setErrorMessage('Open the password reset link from your email to choose a new password.');
        return;
      }
      if (callback.code) {
        const { error } = await supabase.auth.exchangeCodeForSession(callback.code);
        if (error) {
          if (active) setErrorMessage(error.message);
          return;
        }
      } else if (callback.tokenHash && callback.type === 'recovery') {
        const { error } = await supabase.auth.verifyOtp({ token_hash: callback.tokenHash, type: callback.type as EmailOtpType });
        if (error) {
          if (active) setErrorMessage(error.message);
          return;
        }
      }
      const { data, error } = await supabase.auth.getSession();
      if (!active) return;
      if (error || !data.session) setErrorMessage(error?.message ?? 'This reset link is invalid or has expired. Request a new one.');
      else {
        setReady(true);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };
    void prepareRecovery();
    return () => { active = false; };
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) toast.error(error.message);
    else {
      toast.success('Password updated. Please sign in with your new password.');
      await supabase.auth.signOut();
      navigate('/auth');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="glass-strong w-full max-w-md p-8">
        <h1 className="text-2xl font-display font-bold gradient-text mb-2">🦁 Script Safari</h1>
        <h2 className="text-lg font-semibold mb-6">Choose a new password</h2>
        {errorMessage && <p role="alert" className="mb-5 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{errorMessage}</p>}
        {ready && <form onSubmit={submit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="new-password">New password</Label>
            <Input id="new-password" type="password" minLength={6} required value={password} onChange={event => setPassword(event.target.value)} autoComplete="new-password" />
          </div>
          <Button type="submit" disabled={submitting} className="w-full">{submitting ? 'Please wait...' : 'Update password'}</Button>
        </form>}
        {errorMessage && <Button type="button" variant="link" onClick={() => navigate('/auth')} className="mt-4 h-auto p-0">Return to sign in</Button>}
      </div>
    </div>
  );
}