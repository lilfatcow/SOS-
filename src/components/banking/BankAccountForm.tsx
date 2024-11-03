import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBanking } from '@/hooks/useBanking';
import { Loader2 } from 'lucide-react';
import type { CreateBankAccountRequest } from '@monite/sdk-api';

interface BankAccountFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function BankAccountForm({ onSuccess, onCancel }: BankAccountFormProps) {
  const { create, loading } = useBanking();
  const [formData, setFormData] = useState<CreateBankAccountRequest>({
    name: '',
    iban: '',
    bic: '',
    bank_name: '',
    currency: 'USD'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await create(formData);
    if (result) {
      onSuccess?.();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Account Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Business Checking"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="iban">IBAN</Label>
        <Input
          id="iban"
          name="iban"
          value={formData.iban}
          onChange={handleChange}
          placeholder="Enter IBAN"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bic">BIC/SWIFT</Label>
        <Input
          id="bic"
          name="bic"
          value={formData.bic}
          onChange={handleChange}
          placeholder="Enter BIC/SWIFT code"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bank_name">Bank Name</Label>
        <Input
          id="bank_name"
          name="bank_name"
          value={formData.bank_name}
          onChange={handleChange}
          placeholder="Enter bank name"
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add Bank Account
        </Button>
      </div>
    </form>
  );
}