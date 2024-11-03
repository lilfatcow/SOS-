import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { AlertDialog, AlertDialogContent, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Upload } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddBillProps {
  existingBill?: any;
  onSave: (billData: any) => void;
  onPayNow: (billData: any) => void;
}

export function AddBill({ existingBill, onSave, onPayNow }: AddBillProps) {
  const [showCancelAlert, setShowCancelAlert] = useState(false);
  const [billData, setBillData] = useState({
    title: existingBill?.title || '',
    amount: existingBill?.amount || '',
    dueDate: existingBill?.dueDate || '',
    vendor: existingBill?.vendor || '',
    notes: existingBill?.notes || '',
    category: existingBill?.category || '',
    status: existingBill?.status || 'draft'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setBillData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // Handle file drop for OCR
    const files = Array.from(e.dataTransfer.files);
    // Process files for OCR
    console.log('Processing files:', files);
  };

  const isFormValid = () => {
    return billData.title && billData.amount && billData.dueDate && billData.vendor;
  };

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="px-6 pt-6">
        <SheetTitle>{existingBill ? 'Edit Bill' : 'Add New Bill'}</SheetTitle>
        <SheetDescription>
          Upload a bill or enter details manually
        </SheetDescription>
      </SheetHeader>

      <ScrollArea className="flex-1 px-6">
        <div className="space-y-6 py-6">
          <div 
            className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drag and drop a bill here or click to upload
            </p>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*,.pdf"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                console.log('Processing files:', files);
              }}
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Bill Title</Label>
              <Input
                id="title"
                name="title"
                value={billData.title}
                onChange={handleChange}
                placeholder="Enter bill title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                value={billData.amount}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={billData.dueDate}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor</Label>
              <Input
                id="vendor"
                name="vendor"
                value={billData.vendor}
                onChange={handleChange}
                placeholder="Enter vendor name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={billData.category}
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                name="notes"
                value={billData.notes}
                onChange={handleChange}
                placeholder="Add any notes"
              />
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-6 space-x-2">
        <Button
          variant="outline"
          onClick={() => setShowCancelAlert(true)}
        >
          Cancel
        </Button>
        <Button
          variant="outline"
          onClick={() => onSave(billData)}
          disabled={!isFormValid()}
        >
          Save Draft
        </Button>
        <Button
          onClick={() => onPayNow(billData)}
          disabled={!isFormValid()}
        >
          Continue to Payment
        </Button>
      </div>

      <AlertDialog open={showCancelAlert} onOpenChange={setShowCancelAlert}>
        <AlertDialogContent>
          <SheetTitle>Are you sure?</SheetTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Any unsaved changes will be lost.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <AlertDialogCancel>Continue Editing</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowCancelAlert(false);
                // Close the sheet
                document.querySelector('[data-radix-collection-item]')?.click();
              }}
            >
              Discard Changes
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}