import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import SocialLoginButtons from './SocialLoginButtons';
import { useAuth } from './AuthProvider';

// Mock the useAuth hook
vi.mock('./AuthProvider', () => ({
  useAuth: vi.fn(),
}));

describe('SocialLoginButtons', () => {
  const mockSignInWithProvider = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      signInWithProvider: mockSignInWithProvider,
      loading: false,
    });
  });

  it('renders with default title', () => {
    render(<SocialLoginButtons />);
    
    expect(screen.getByText('Or continue with')).toBeInTheDocument();
    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(<SocialLoginButtons title="Sign up with" />);
    
    expect(screen.getByText('Sign up with')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<SocialLoginButtons className="custom-class" />);
    
    const rootElement = container.firstChild as HTMLElement;
    expect(rootElement.classList.contains('custom-class')).toBe(true);
  });

  it('calls signInWithProvider with "google" when Google button is clicked', async () => {
    render(<SocialLoginButtons />);
    
    fireEvent.click(screen.getByText('Google'));
    
    expect(mockSignInWithProvider).toHaveBeenCalledWith('google');
  });

  it('calls signInWithProvider with "github" when GitHub button is clicked', async () => {
    render(<SocialLoginButtons />);
    
    fireEvent.click(screen.getByText('GitHub'));
    
    expect(mockSignInWithProvider).toHaveBeenCalledWith('github');
  });

  it('disables buttons when loading', () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      signInWithProvider: mockSignInWithProvider,
      loading: true,
    });
    
    render(<SocialLoginButtons />);
    
    const googleButton = screen.getByText('Google').closest('button');
    const githubButton = screen.getByText('GitHub').closest('button');
    
    expect(googleButton).toBeDisabled();
    expect(githubButton).toBeDisabled();
  });

  it('disables buttons when one provider is loading', async () => {
    render(<SocialLoginButtons />);
    
    // Click Google button
    const googleButton = screen.getAllByRole('button')[0];
    fireEvent.click(googleButton);
    
    // Check that both buttons are now disabled
    const buttons = screen.getAllByRole('button');
    
    expect(buttons[0]).toBeDisabled();
    expect(buttons[1]).toBeDisabled();
  });

  it('shows loading spinner when Google is loading', async () => {
    render(<SocialLoginButtons />);
    
    // Click Google button
    const googleButton = screen.getAllByRole('button')[0];
    fireEvent.click(googleButton);
    
    // Find the spinner (div with animate-spin class)
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('handles errors during sign in', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockSignInWithProvider.mockRejectedValue(new Error('Sign in failed'));
    
    render(<SocialLoginButtons />);
    
    fireEvent.click(screen.getByText('Google'));
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error signing in with google:',
        expect.any(Error)
      );
    });
    
    consoleErrorSpy.mockRestore();
  });
});
