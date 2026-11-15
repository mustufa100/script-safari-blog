import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider, useAuth } from '@/hooks/useAuth';

const auth = vi.hoisted(() => ({
  signUp: vi.fn(),
  onAuthStateChange: vi.fn(),
}));

vi.mock('@/integrations/supabase/client', () => ({ supabase: { auth } }));

function RegistrationProbe() {
  const { signUp } = useAuth();
  const [state, setState] = useState('idle');
  return (
    <button
      onClick={async () => {
        const { error, session } = await signUp('reader@example.com', 'secret-password', 'New Reader');
        setState(!error && session ? 'signed-in' : 'not-signed-in');
      }}
    >
      {state}
    </button>
  );
}

describe('immediate registration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });
    auth.signUp.mockResolvedValue({ data: { session: { access_token: 'active-session' } }, error: null });
  });

  it('returns the new session without requesting a verification email redirect', async () => {
    render(<AuthProvider><RegistrationProbe /></AuthProvider>);
    fireEvent.click(screen.getByRole('button'));

    expect(await screen.findByText('signed-in')).toBeInTheDocument();
    expect(auth.signUp).toHaveBeenCalledExactlyOnceWith({
      email: 'reader@example.com',
      password: 'secret-password',
      options: { data: { display_name: 'New Reader' } },
    });
  });
});
