import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SignInForm } from '@/components/auth/SignInForm';
import { MoniteProvider } from '@/contexts/MoniteContext';
import { BrowserRouter } from 'react-router-dom';

describe('Authentication', () => {
  it('renders sign in form correctly', () => {
    render(
      <BrowserRouter>
        <MoniteProvider>
          <SignInForm />
        </MoniteProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Welcome to WonderPay')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('name@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    render(
      <BrowserRouter>
        <MoniteProvider>
          <SignInForm />
        </MoniteProvider>
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('name@example.com'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(localStorage.getItem('wonderpay_auth')).toBeTruthy();
    });
  });
});