import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { usePaymentProcessor } from '@/hooks/usePaymentProcessor';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface BankAccountVerificationProps {
  bankAccountId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function BankAccountVerification({ 
  bankAccountId, 
  onSuccess, 
  onCancel 
}: BankAccountVerificationProps) {
  const { verifyBankAccount, loading } = usePaymentProcessor();
  const [amount1, setAmount1] = useState('');
  const [amount2, setAmount2] = useState('');
  const [verified, setVerified] = useState(false);

  const handleVerify = async () => {
    const success = await verifyBankAccount(bankAccountId);
    if (success) {
      setVerified(true);
      onSuccess?.();
    }
  };

  return (
    <Card className="p-6">
      {verified ? (
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-medium">Bank Account Verified</h3>
          <p className="text-sm text-muted-foreground text-center">
            Your bank account has been successfully verified and is ready for use.
          </p>
          <Button onClick={onCancel}>Done</Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Verify Bank Account</h3>
            <p className="text-sm text-muted-foreground">
              Enter the two small deposit amounts that were sent to your account to complete verification.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>First Deposit Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount1}
                  onChange={(e) => setAmount1(e.target.value)}
                  className="pl-7"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Second Deposit Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount2}
                  onChange={(e) => setAmount2(e.target.value)}
                  className="pl-7"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleVerify}
              disabled={loading || !amount1 || !amount2}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify Account
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}