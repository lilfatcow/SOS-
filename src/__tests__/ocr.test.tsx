import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DocumentScanner } from '@/components/ocr/DocumentScanner';
import { MoniteProvider } from '@/contexts/MoniteContext';

describe('OCR Processing', () => {
  it('renders document scanner correctly', () => {
    render(
      <MoniteProvider>
        <DocumentScanner onScanComplete={() => {}} />
      </MoniteProvider>
    );

    expect(screen.getByText('Upload your bill')).toBeInTheDocument();
    expect(screen.getByText('Select File')).toBeInTheDocument();
  });

  it('handles file upload', async () => {
    const onScanComplete = vi.fn();
    render(
      <MoniteProvider>
        <DocumentScanner onScanComplete={onScanComplete} />
      </MoniteProvider>
    );

    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByTestId('file-input');

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('Processing document...')).toBeInTheDocument();
    });
  });
});