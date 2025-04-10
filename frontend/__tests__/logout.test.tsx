import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const mockRouterPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

import { useRouter } from 'next/navigation';
(useRouter as jest.Mock).mockReturnValue({
  push: mockRouterPush,
});


jest.mock('@/utils/supabase/client', () => ({
  supabase: {
    auth: {
      signOut: jest.fn(),
    },
  },
}));

jest.mock('@/app/providers/authprovider', () => ({
  useAuth: () => ({
    refreshAuthState: jest.fn().mockResolvedValue(undefined),
  }),
}));


import { Logout } from '@/app/components/logout';
import { supabase } from '@/utils/supabase/client';

describe('Logout Component', () => {
  it('renders the logout button', () => {
    render(<Logout />);
    const button = screen.getByRole('button', { name: /logout/i });
    expect(button).toBeInTheDocument();
  });

  it('calls logout button', async () => {

    (supabase.auth.signOut as jest.Mock).mockResolvedValue({ error: null });

    render(<Logout />);
    const button = screen.getByRole('button', { name: /logout/i });
    await fireEvent.click(button);

    await waitFor(() => {
      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(mockRouterPush).toHaveBeenCalledWith('/signin');
    });
  });

  it('handles logout error', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); 

    (supabase.auth.signOut as jest.Mock).mockResolvedValue({
      error: new Error('Sign out failed'),
    });

    render(<Logout />);
    const button = screen.getByRole('button', { name: /logout/i });
    await fireEvent.click(button);

    expect(consoleErrorSpy).toHaveBeenCalled(); 
    consoleErrorSpy.mockRestore(); 
  });
});