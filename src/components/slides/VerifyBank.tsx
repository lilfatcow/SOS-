import { Button } from '@/components/ui/button';
import { SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ArrowRight, Zap, Clock } from 'lucide-react';

export function VerifyBank() {
  return (
    <div className="space-y-6">
      <SheetHeader>
        <SheetTitle>Verify your bank account</SheetTitle>
        <SheetDescription>
          Verify your bank account to pay bills and collect invoices. Opt for Instant connect to unlock the full WonderPay experience.
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-4">
        <Button
          variant="outline"
          className="w-full justify-between h-auto p-4 group"
          onClick={() => console.log('Instant connect')}
        >
          <div className="flex items-start gap-4">
            <Zap className="h-5 w-5 mt-0.5" />
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-medium">Instant connect</span>
                <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">Recommended</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Securely connect to your bank account and get access to everything WonderPay offers instantly, including faster payments.
              </p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </Button>

        <Button
          variant="outline"
          className="w-full justify-between h-auto p-4 group"
          onClick={() => console.log('Manual verification')}
        >
          <div className="flex items-start gap-4">
            <Clock className="h-5 w-5 mt-0.5" />
            <div className="text-left">
              <div className="font-medium">Verify with manual deposit</div>
              <p className="text-sm text-muted-foreground mt-1">
                Manually verify your bank account to pay bills and collect invoices. The manual deposit takes up to 2 business days.
              </p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </Button>
      </div>
    </div>
  );
}