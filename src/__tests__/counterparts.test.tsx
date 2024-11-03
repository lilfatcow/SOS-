import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CounterpartList } from '@/components/counterparts/CounterpartList';
import { MoniteProvider } from '@/contexts/MoniteContext';

describe('Counterparts Management', () => {
  it('renders counterparts list correctly', () => {
    render(
      <MoniteProvider>
        <CounterpartList />
      </MoniteProvider>
    );

    expect(screen.getByText('Contacts')).toBeInTheDocument();
    expect(screen.getByText('Add Contact')).toBeInTheDocument();
  });

  it('handles contact addition', async () => {
    render(
      <MoniteProvider>
        <CounterpartList />
      </MoniteProvider>
    );

    fireEvent.click(screen.getByText('Add Contact'));

    await waitFor(() => {
      expect(screen.getByText('Add New Contact')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Organization Name'), {
      target: { value: 'Test Company' },
    });

    fireEvent.click(screen.getByText('Add Contact'));

    await waitFor(() => {
      expect(screen.getByText('Contact added successfully')).toBeInTheDocument();
    });
  });
});