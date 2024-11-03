import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PaymentProcessor } from '@/components/payments/PaymentProcessor';
import { MoniteProvider } from '@/contexts/MoniteContext';

describe('Payment Processing', () => {
  it('renders payment options correctly', () => {
    render(
      <MoniteProvider>
        <PaymentProcessor amount={100} />
      </MoniteProvider>
    );

    expect(screen.getByText('Payment Details')).toBeInTheDocument();
    expect(screen.getByText('$100.00 USD')).toBeInTheDocument();
  });

  it('handles payment method selection', async () => {
    render(
      <MoniteProvider>
        <PaymentProcessor amount={100} />
      </MoniteProvider>
    );

    fireEvent.click(screen.getByText('Select payment method'));
    fireEvent.click(screen.getByText('ACH Transfer (Free)'));

    await waitFor(() => {
      expect(screen.getByText('Select bank account')).toBeInTheDocument();
    });
  });
});