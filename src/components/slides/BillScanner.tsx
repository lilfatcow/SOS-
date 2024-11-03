import { useState } from 'react';
import { DocumentScanner } from '@/components/ocr/DocumentScanner';
import { BillDetails } from './BillDetails';
import { PaymentDetails } from './PaymentDetails';
import { SheetHeader, SheetTitle, SheetDescription, SheetContent } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogContent, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import type { PayableResponse } from '@monite/sdk-api';

interface BillScannerProps {
  initialData?: PayableResponse;
  onSaveDraft: (data: PayableResponse) => void;
  onClose: () => void;
}

export function BillScanner({ initialData, onSaveDraft, onClose }: BillScannerProps) {
  const { toast } = useToast();
  const [showCancelAlert, setShowCancelAlert] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [billData, setBillData] = useState<PayableResponse | null>(initialData || null);

  const handleScanComplete = (data: PayableResponse) => {
    setBillData(data);
    toast({
      title: 'Document Processed',
      description: 'Bill details have been extracted successfully.',
    });
  };

  const handleSaveDraft = () => {
    if (billData) {
      onSaveDraft(billData);
      toast({
        title: 'Draft Saved',
        description: 'Bill has been saved to drafts.',
      });
    }
  };

  const handlePayNow = () => {
    if (!billData) {
      toast({
        title: 'Error',
        description: 'Please complete bill details before proceeding to payment.',
        variant: 'destructive',
      });
      return;
    }
    setShowPayment(true);
  };

  const handleCancel = () => {
    if (billData) {
      setShowCancelAlert(true);
    } else {
      onClose();
    }
  };

  return (
    <SheetContent side="right" className="w-full sm:w-[800px] p-0">
      <div className="flex flex-col h-full">
        <SheetHeader className="px-6 pt-6">
          <SheetTitle>
            {showPayment ? 'Payment Details' : 'Add New Bill'}
          </SheetTitle>
          <SheetDescription>
            {showPayment 
              ? 'Choose your preferred payment method'
              : 'Upload a bill or enter details manually'
            }
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-6 py-6">
            {showPayment ? (
              <PaymentDetails 
                billData={billData}
                onBack={() => setShowPayment(false)}
                onSuccess={onClose}
              />
            ) : (
              <>
                {!billData && (
                  <DocumentScanner onScanComplete={handleScanComplete} />
                )}

                {billData && (
                  <BillDetails
                    data={billData}
                    onChange={setBillData}
                    onCancel={handleCancel}
                    onSaveDraft={handleSaveDraft}
                    onPayNow={handlePayNow}
                  />
                )}
              </>
            )}
          </div>
        </ScrollArea>

        <AlertDialog open={showCancelAlert} onOpenChange={setShowCancelAlert}>
          <AlertDialogContent>
            <SheetTitle>Are you sure?</SheetTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Any unsaved changes will be lost.
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <AlertDialogCancel>Continue Editing</AlertDialogCancel>
              <AlertDialogAction onClick={onClose}>
                Discard Changes
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </SheetContent>
  );
}