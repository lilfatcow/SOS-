import { useState } from 'react';
import { useMonite } from '@/contexts/MoniteContext';
import { useToast } from '@/components/ui/use-toast';
import type { CreatePaymentIntentRequest } from '@monite/sdk-api';

export function useMonitePayments() {
  const { monite } = useMonite();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const createPaymentIntent = async (data: CreatePaymentIntentRequest) => {
    if (!monite) {
      toast({
        title: 'Error',
        description: 'Monite SDK not initialized',
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

  const processPayment = async (intentId: string) => {
    if (!monite) return null;

    setLoading(true);

    try {
      const result = await monite.payments.processIntent(intentId);
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

  return {
    createPaymentIntent,
    processPayment,
    loading
  };
}