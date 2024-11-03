import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePayments } from '@/hooks/usePayments';
import { useToast } from '@/components/ui/use-toast';
import { 
  CreditCard, 
  ArrowLeft, 
  Building2, 
  CircleDollarSign,
  BanknoteIcon,
  Clock,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';

interface PaymentDetailsProps {
  billData: any;
  onBack: () => void;
  onSuccess?: () => void;
}

export function PaymentDetails({ billData, onBack, onSuccess }: PaymentDetailsProps) {
  const [paymentMethod, setPaymentMethod] = useState<'ach' | 'card' | 'wire' | 'wonderflex' | null>(null);
  const [selectedAccount, setSelectedAccount] = useState('');
  const { createIntent, process, getMethods, loading } = usePayments();
  const { toast } = useToast();
  const [availableMethods, setAvailableMethods] = useState<any[]>([]);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      const methods = await getMethods();
      setAvailableMethods(methods);
    };
    fetchPaymentMethods();
  }, []);

  const handlePayment = async () => {
    if (!paymentMethod || !selectedAccount) {
      toast({
        title: 'Error',
        description: 'Please select a payment method and account',
        variant: 'destructive',
      });
      return;
    }

    try {
      const intent = await createIntent({
        amount: Number(billData.amount),
        currency: 'USD',
        payment_method: paymentMethod === 'wonderflex' ? 'ach' : paymentMethod,
        description: `Payment for ${billData.title}`,
      });

      if (intent) {
        const result = await process(intent.id);
        if (result) {
          onSuccess?.();
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process payment',
        variant: 'destructive',
      });
    }
  };

  const PaymentOption = ({ 
    id, 
    title, 
    description, 
    icon: Icon,
    processing = false,
    recommended = false,
    fee = null
  }: {
    id: 'ach' | 'card' | 'wire' | 'wonderflex';
    title: string;
    description: string;
    icon: any;
    processing?: boolean;
    recommended?: boolean;
    fee?: string | null;
  }) => (
    <button
      className={cn(
        "w-full p-4 rounded-lg border-2 text-left transition-colors",
        paymentMethod === id 
          ? "border-primary bg-primary/5" 
          : "border-border hover:border-primary/50",
      )}
      onClick={() => setPaymentMethod(id)}
    >
      <div className="flex items-start gap-4">
        <Icon className="h-5 w-5 mt-0.5" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium">{title}</span>
              {recommended && (
                <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                  Recommended
                </span>
              )}
            </div>
            {fee && (
              <span className="text-sm text-muted-foreground">
                {fee}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {description}
          </p>
          {processing && (
            <div className="flex items-center gap-2 mt-2 text-sm text-orange-600">
              <Clock className="h-3 w-3" />
              Processing time: 2-3 business days
            </div>
          )}
        </div>
      </div>
    </button>
  );

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="px-6 pt-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <SheetTitle>Payment Details</SheetTitle>
        </div>
        <SheetDescription>
          Choose your preferred payment method
        </SheetDescription>
      </SheetHeader>

      <ScrollArea className="flex-1 px-6">
        <div className="space-y-6 py-6">
          <div>
            <div className="text-sm font-medium mb-2">Amount Due</div>
            <div className="text-3xl font-semibold">
              ${Number(billData?.amount).toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Due by {billData?.dueDate}
            </div>
          </div>

          <div className="space-y-3">
            <PaymentOption
              id="ach"
              title="Pay by ACH"
              description="Direct bank transfer (ACH) with no additional fees"
              icon={Building2}
              recommended
              fee="Free"
            />
            
            <PaymentOption
              id="card"
              title="Pay by Card"
              description="Pay using credit or debit card"
              icon={CreditCard}
              fee="2.9% + $0.30"
            />
            
            <PaymentOption
              id="wire"
              title="Wire Transfer"
              description="Send a domestic or international wire transfer"
              icon={BanknoteIcon}
              processing
              fee="$25.00"
            />

            <PaymentOption
              id="wonderflex"
              title="WonderFlex Pay"
              description="Split your payment into flexible installments"
              icon={CircleDollarSign}
            />
          </div>

          {paymentMethod && (
            <div className="space-y-4 pt-6 border-t">
              <div className="space-y-2">
                <label className="text-sm font-medium">From Account</label>
                <Select
                  value={selectedAccount}
                  onValueChange={setSelectedAccount}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Business Checking ****3862</SelectItem>
                    <SelectItem value="savings">Business Savings ****4577</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {paymentMethod === 'wonderflex' && (
                <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    WonderFlex Pay Terms
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Split this payment into 3 monthly installments of ${(Number(billData?.amount) / 3).toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      {paymentMethod && (
        <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-6">
          <Button 
            className="w-full"
            disabled={loading || !selectedAccount}
            onClick={handlePayment}
          >
            {loading ? 'Processing...' : 'Continue to Payment'}
          </Button>
        </div>
      )}
    </div>
  );
}