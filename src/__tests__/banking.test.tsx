import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BankAccountList } from '@/components/banking/BankAccountList';
import { MoniteProvider } from '@/contexts/MoniteContext';

describe('Banking Integration', () => {
  it('renders banking interface correctly', () => {
    render(
      <MoniteProvider>
        <BankAccountList />
      </MoniteProvider>
    );

    expect(screen.getByText('Connected Bank Accounts')).toBeInTheDocument();
    expect(screen.getByText('Add Account')).toBeInTheDocument();
  });

  it('handles bank account addition', async () => {
    render(
      <MoniteProvider>
        <BankAccountList />
      </MoniteProvider>
    );

    fireEvent.click(screen.getByText('Add Account'));

    await waitFor(() => {
      expect(screen.getByText('Add Bank Account')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Account Name'), {
      target: { value: 'Test Account' },
    });

    fireEvent.click(screen.getByText('Add Bank Account'));

    await waitFor(() => {
      expect(screen.getByText('Bank account added successfully')).toBeInTheDocument();
    });
  });
});