import { getMoniteInstance } from './config';
import type { 
  PaymentIntentResponse,
  CreatePaymentIntentRequest,
  PaymentMethodResponse
} from '@monite/sdk-api';

export class MonitePaymentsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MonitePaymentsError';
  }
}

export async function createPaymentIntent(data: CreatePaymentIntentRequest): Promise<PaymentIntentResponse> {
  try {
    const monite = getMoniteInstance();
    const intent = await monite.payments.createIntent(data);
    return intent;
  } catch (error) {
    throw new MonitePaymentsError('Failed to create payment intent');
  }
}

export async function getPaymentMethods(): Promise<PaymentMethodResponse[]> {
  try {
    const monite = getMoniteInstance();
    const methods = await monite.payments.getMethods();
    return methods.data;
  } catch (error) {
    throw new MonitePaymentsError('Failed to fetch payment methods');
  }
}

export async function processPayment(intentId: string): Promise<PaymentIntentResponse> {
  try {
    const monite = getMoniteInstance();
    const result = await monite.payments.processIntent(intentId);
    return result;
  } catch (error) {
    throw new MonitePaymentsError('Failed to process payment');
  }
}