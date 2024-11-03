import type { PayableResponse } from '@monite/sdk-api';

export interface ProcessedBill {
  id: string;
  amount: number;
  currency: string;
  due_date?: string;
  issue_date?: string;
  counterpart_name?: string;
  counterpart_address?: string;
  counterpart_bank_account?: {
    iban?: string;
    bic?: string;
  };
  line_items?: Array<{
    description?: string;
    quantity?: number;
    unit_price?: number;
  }>;
  status: 'draft' | 'processing' | 'approved' | 'paid';
  document_id?: string;
  ocr_data?: PayableResponse;
}

export interface PaymentMethod {
  id: string;
  type: 'ach' | 'card' | 'wire';
  name: string;
  last4?: string;
  bank_name?: string;
}