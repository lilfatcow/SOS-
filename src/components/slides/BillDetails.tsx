import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMonite } from '@/contexts/MoniteContext';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BillDetailsProps {
  data: any;
  onChange: (data: any) => void;
  onCancel: () => void;
  onSaveDraft: () => void;
  onPayNow: () => void;
}

export function BillDetails({ data, onChange, onCancel, onSaveDraft, onPayNow }: BillDetailsProps) {
  const { loading } = useMonite();
  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    onChange({
      ...data,
      [field]: value,
      lastModified: new Date(),
    });
  };

  const validateForm = () => {
    const required = ['contact', 'amount', 'dueDate'];
    const missing = required.filter(field => !data[field]);
    
    if (missing.length > 0) {
      toast({
        title: 'Required Fields',
        description: `Please fill in all required fields: ${missing.join(', ')}`,
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  const handleSaveDraft = () => {
    if (validateForm()) {
      onSaveDraft();
    }
  };

  const handlePayNow = () => {
    if (validateForm()) {
      onPayNow();
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Bill Details</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={handleSaveDraft}
            disabled={loading}
          >
            Save Draft
          </Button>
          <Button 
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handlePayNow}
            disabled={loading}
          >
            Pay Now
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 items-center gap-4">
          <Label className="text-right">Contact</Label>
          <Select
            value={data.contact}
            onValueChange={(value) => handleChange('contact', value)}
          >
            <SelectTrigger className="col-span-2">
              <SelectValue placeholder="Select contact" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="contact1">24/7 Productions</SelectItem>
              <SelectItem value="contact2">SuperBloom House</SelectItem>
              <SelectItem value="contact3">Add New Contact</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-3 items-center gap-4">
          <Label className="text-right">Bill Number</Label>
          <Input 
            className="col-span-2"
            value={data.billNumber}
            onChange={(e) => handleChange('billNumber', e.target.value)}
            placeholder="Enter bill number"
          />
        </div>

        <div className="grid grid-cols-3 items-center gap-4">
          <Label className="text-right">Amount</Label>
          <div className="col-span-2 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <Input 
              className="pl-7"
              type="number"
              step="0.01"
              value={data.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 items-center gap-4">
          <Label className="text-right">Due Date</Label>
          <Input 
            className="col-span-2"
            type="date"
            value={data.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 items-center gap-4">
          <Label className="text-right">Category</Label>
          <Select
            value={data.category}
            onValueChange={(value) => handleChange('category', value)}
          >
            <SelectTrigger className="col-span-2">
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

        <div className="grid grid-cols-3 items-center gap-4">
          <Label className="text-right">Notes</Label>
          <Input 
            className="col-span-2"
            value={data.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Add notes (optional)"
          />
        </div>
      </div>
    </Card>
  );
}