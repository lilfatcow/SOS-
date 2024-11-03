import { useState, useEffect } from 'react';
import { usePaymentProcessor } from '@/hooks/usePaymentProcessor';
import { useBanking } from '@/hooks/useBanking';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CreditCard, Building2, BanknoteIcon, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { BankAccountResponse } from '@monite/sdk-api';

interface PaymentProcessorProps {
  amount: number;
  currency?: string;
  payableId?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function PaymentProcessor({
  amount,
  currency = 'USD',
  payableId,
  onSuccess,
  onError
}: PaymentProcessorProps) {
  const { processPayment, getPaymentMethods, verifyBankAccount, loading } = usePaymentProcessor();
  const { list: listBankAccounts } = useBanking();
  const [selectedMethod, setSelectedMethod] = useState<'ach' | 'card' | 'wire' | null>(null);
  const [selectedBankAccount, setSelectedBankAccount] = useState<string>('');
  const [availableMethods, setAvailableMethods] = useState<any[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccountResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPaymentMethods();
    loadBankAccounts();
  }, []);

  const loadPaymentMethods = async () => {
    const methods = await getPaymentMethods();
    setAvailableMethods(methods);
  };

  const loadBankAccounts = async () => {
    const accounts = await listBankAccounts();
    setBankAccounts(accounts);
  };

  const handlePayment = async () => {
    if (!selectedMethod) {
      setError('Please select a payment method');
      return;
    }

    if (selectedMethod === 'ach' && !selectedBankAccount) {
      setError('Please select a bank account');
      return;
    }

    setError(null);

    try {
      // For ACH payments, verify bank account first
      if (selectedMethod === 'ach' && selectedBankAccount) {
        const isVerified = await verifyBankAccount(selectedBankAccount);
        if (!isVerified) {
          throw new Error('Bank account verification failed');
        }
      }

      const result = await processPayment({
        amount,
        currency,
        method: selectedMethod,
        payableId,
        bankAccountId: selectedMethod === 'ach' ? selectedBankAccount : undefined,
      });

      if (result) {
        onSuccess?.();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      setError(errorMessage);
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return <CreditCard className="h-5 w-5" />;
      case 'ach':
        return <Building2 className="h-5 w-5" />;
      case 'wire':
        return <BanknoteIcon className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <Card className="p-6">
      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Payment Details</h3>
            <p className="text-sm text-muted-foreground">
              Select your preferred payment method to complete the transaction.
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Amount</Label>
              <div className="text-2xl font-semibold">
                ${amount.toFixed(2)} {currency}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select
                value={selectedMethod || ''}
                onValueChange={(value) => {
                  setSelectedMethod(value as any);
                  setError(null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ach">
                    <div className="flex items-center gap-2">
                      {getMethodIcon('ach')}
                      <span>ACH Transfer (Free)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="card">
                    <div className="flex items-center gap-2">
                      {getMethodIcon('card')}
                      <span>Credit Card (2.9% + $0.30)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="wire">
                    <div className="flex items-center gap-2">
                      {getMethodIcon('wire')}
                      <span>Wire Transfer ($25.00)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedMethod === 'ach' && (
              <div className="space-y-2">
                <Label>Bank Account</Label>
                <Select
                  value={selectedBankAccount}
                  onValueChange={setSelectedBankAccount}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select bank account" />
                  </SelectTrigger>
                  <SelectContent>
                    {bankAccounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          <span>{account.name} (****{account.iban?.slice(-4)})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button
              className="w-full"
              disabled={!selectedMethod || loading}
              onClick={handlePayment}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Processing...' : 'Complete Payment'}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              By proceeding, you agree to our terms of service and privacy policy.
            </p>
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
}