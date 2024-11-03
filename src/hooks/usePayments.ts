import { useState } from 'react';
import { useMonite } from '@/contexts/MoniteContext';
import { useToast } from '@/components/ui/use-toast';
import type { PaymentIntentResponse } from '@monite/sdk-api';

export function usePayments() {
  const { monite } = useMonite();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const createIntent = async (data: {
    amount: number;
    currency: string;
    payment_method: 'ach' | 'card' | 'wire';
    description?: string;
  }): Promise<PaymentIntentResponse | null> => {
    if (!monite) {
      toast({
        title: 'Error',
        description: 'Payment service not initialized',
        variant: 'destructive',
      });
      return null;
    }

    setLoading(true);
    try {
      const intent = await monite.payments.createIntent(data);
      return intent;
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create payment intent',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const process = async (intentId: string): Promise<PaymentIntentResponse | null> => {
    if (!monite) return null;

    setLoading(true);
    try {
      const result = await monite.payments.processIntent(intentId);
      toast({
        title: 'Success',
        description: 'Payment processed successfully',
      });
      return result;
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to process payment',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getMethods = async () => {
    if (!monite) return [];

    try {
      const response = await monite.payments.getMethods();
      return response.data;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch payment methods',
        variant: 'destructive',
      });
      return [];
    }
  };

  return {
    createIntent,
    process,
    getMethods,
    loading
  };
}