import { useState } from 'react';
import { useMonite } from '@/contexts/MoniteContext';
import { useToast } from '@/hooks/use-toast';
import type { PaymentIntentResponse, PaymentMethodResponse } from '@monite/sdk-api';

export function usePaymentProcessor() {
  const { monite } = useMonite();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const validatePaymentMethod = async (method: string): Promise<boolean> => {
    if (!monite) return false;

    try {
      const methods = await monite.payments.getMethods();
      return methods.data.some(m => m.type === method && m.status === 'active');
    } catch (error) {
      console.error('Payment method validation failed:', error);
      return false;
    }
  };

  const processPayment = async (data: {
    amount: number;
    currency: string;
    method: 'ach' | 'card' | 'wire';
    payableId?: string;
    bankAccountId?: string;
    wonderflex?: boolean;
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
      // Validate payment method
      const isValidMethod = await validatePaymentMethod(data.method);
      if (!isValidMethod) {
        throw new Error('Selected payment method is not available');
      }

      // If WonderFlex is enabled, modify the payment terms
      const paymentTerms = data.wonderflex ? {
        installments: 3,
        interval: 'month',
        first_payment_percentage: 33.33
      } : undefined;

      // Create payment intent
      const intent = await monite.payments.createIntent({
        amount: data.amount,
        currency: data.currency,
        payment_method: data.method,
        payable_id: data.payableId,
        bank_account_id: data.bankAccountId,
        payment_terms: paymentTerms
      });

      // Process the payment
      const result = await monite.payments.processIntent(intent.id);

      toast({
        title: 'Success',
        description: 'Payment processed successfully',
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment processing failed';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethods = async (): Promise<PaymentMethodResponse[]> => {
    if (!monite) return [];

    try {
      const response = await monite.payments.getMethods();
      return response.data.filter(method => method.status === 'active');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch payment methods',
        variant: 'destructive',
      });
      return [];
    }
  };

  const verifyBankAccount = async (bankAccountId: string): Promise<boolean> => {
    if (!monite) return false;

    try {
      await monite.bankAccounts.verify(bankAccountId);
      toast({
        title: 'Success',
        description: 'Bank account verified successfully',
      });
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Bank account verification failed',
        variant: 'destructive',
      });
      return false;
    }
  };

  const schedulePayment = async (intentId: string, date: Date): Promise<boolean> => {
    if (!monite) return false;

    try {
      await monite.payments.scheduleIntent(intentId, {
        scheduled_date: date.toISOString()
      });
      
      toast({
        title: 'Success',
        description: 'Payment scheduled successfully',
      });
      
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to schedule payment',
        variant: 'destructive',
      });
      return false;
    }
  };

  const createRecurringPayment = async (data: {
    amount: number;
    currency: string;
    method: 'ach' | 'card';
    frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    startDate: Date;
    endDate?: Date;
  }): Promise<boolean> => {
    if (!monite) return false;

    try {
      await monite.payments.createRecurring({
        ...data,
        start_date: data.startDate.toISOString(),
        end_date: data.endDate?.toISOString()
      });

      toast({
        title: 'Success',
        description: 'Recurring payment created successfully',
      });

      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create recurring payment',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    processPayment,
    getPaymentMethods,
    verifyBankAccount,
    schedulePayment,
    createRecurringPayment,
    loading
  };
}