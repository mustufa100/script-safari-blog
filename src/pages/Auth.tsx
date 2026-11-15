import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { completeAuthCallback, initialAuthCallback } from '@/lib/authCallback';
import { getAuthRedirectUrl } from '@/lib/authRedirect';

type AuthMode = 'login' | 'signup' | 'forgot';

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [callbackMessage, setCallbackMessage] = useState('');
  const [callbackError, setCallbackError] = useState('');
  const { signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    const handleCallback = async () => {
      const callback = initialAuthCallback;
      if (callback.error) {
        if (active) setCallbackError(callback.error);
        return;
      }
      if (!callback.code && !callback.tokenHash && !callback.hasSessionTokens) return;

      try {
        await completeAuthCallback();
        if (!active) return;
        if (callback.type === 'recovery') { navigate('/reset-password' + window.location.search + window.location.hash, { replace: true }); return; }
        await supabase.auth.signOut({ scope: 'local' });
        if (!active) return;
        setMode('login');
        setCallbackMessage('Your email link is verified. Please sign in to Script Safari.');
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        if (active) setCallbackError(error instanceof Error ? error.message : 'This email link is invalid or has expired.');
      }
    };
    void handleCallback();
    return () => { active = false; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) toast.error(error.message);
      else {
        toast.success('Welcome back!');
        navigate('/admin');
      }
    } else if (mode === 'signup') {
      const { error, session } = await signUp(email, password, displayName);
      if (error) {
        toast.error(error.message);
      } else {
        // Auto-confirmed registrations normally include a session. The fallback also
        // supports configurations that create the user without returning one.
        const loginResult = session ? { error: null } : await signIn(email, password);
        if (loginResult.error) toast.error(loginResult.error.message);
        else {
          toast.success('Account created — you are signed in!');
          window.location.assign(getAuthRedirectUrl('/login'));
        }
      }
    } else {
      const { error } = await resetPassword(email);
      if (error) toast.error(error.message);
      else setCallbackMessage('If an account exists for this email, a password reset link is on its way.');
    }
    setSubmitting(false);
  };

  const title = mode === 'login' ? 'Welcome back, explorer' : mode === 'signup' ? 'Join the safari' : 'Reset your password';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/10 blur-[120px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold gradient-text">🦁 Script Safari</h1>
          <p className="text-muted-foreground mt-2">{title}</p>
        </div>

        <div className="glass-strong p-8">
          {callbackMessage && <p role="status" className="mb-5 rounded-md border border-primary/30 bg-primary/10 p-3 text-sm text-foreground">{callbackMessage}</p>}
          {callbackError && <p role="alert" className="mb-5 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{callbackError}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input id="name" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your name" required className="bg-muted/50 border-border" />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className="bg-muted/50 border-border" />
            </div>
            {mode !== 'forgot' && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} className="bg-muted/50 border-border pr-10" />
                  <Button type="button" variant="ghost" size="icon" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)} className="absolute right-1 top-1/2 -translate-y-1/2">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>
            )}

            <Button type="submit" disabled={submitting} className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
              {submitting ? <span className="animate-pulse">Please wait...</span> : mode === 'login' ? <><LogIn size={16} className="mr-2" /> Sign In</> : mode === 'signup' ? <><UserPlus size={16} className="mr-2" /> Create Account</> : 'Send reset link'}
            </Button>
          </form>

          <div className="mt-6 flex flex-col items-center gap-3 text-center">
            {mode === 'login' && <Button type="button" variant="link" onClick={() => setMode('forgot')} className="h-auto p-0 text-sm text-muted-foreground">Forgot password?</Button>}
            <Button type="button" variant="link" onClick={() => { setCallbackMessage(''); setCallbackError(''); setMode(mode === 'login' ? 'signup' : 'login'); }} className="h-auto p-0 text-sm text-muted-foreground hover:text-primary">
              {mode === 'login' ? "Don't have an account? Sign up" : mode === 'signup' ? 'Already have an account? Sign in' : 'Back to sign in'}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;