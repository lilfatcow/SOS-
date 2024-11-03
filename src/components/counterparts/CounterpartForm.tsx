import { useState } from 'react';
import { useCounterparts } from '@/hooks/useCounterparts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CreateCounterpartRequest } from '@monite/sdk-api';

interface CounterpartFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Partial<CreateCounterpartRequest>;
}

export function CounterpartForm({ onSuccess, onCancel, initialData }: CounterpartFormProps) {
  const { create, loading } = useCounterparts();
  const [formData, setFormData] = useState<CreateCounterpartRequest>({
    type: initialData?.type || 'organization',
    organization: {
      name: initialData?.organization?.name || '',
      tax_id: initialData?.organization?.tax_id || '',
    },
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    address: {
      country: 'US',
      city: '',
      line1: '',
      postal_code: '',
      state: '',
      ...initialData?.address,
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await create(formData);
    if (result) {
      onSuccess?.();
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOrganizationChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      organization: {
        ...prev.organization,
        [field]: value
      }
    }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="organization">Organization</SelectItem>
              <SelectItem value="individual">Individual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.type === 'organization' && (
          <>
            <div className="space-y-2">
              <Label>Organization Name</Label>
              <Input
                value={formData.organization.name}
                onChange={(e) => handleOrganizationChange('name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Tax ID</Label>
              <Input
                value={formData.organization.tax_id}
                onChange={(e) => handleOrganizationChange('tax_id', e.target.value)}
              />
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Phone</Label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Address Line 1</Label>
          <Input
            value={formData.address.line1}
            onChange={(e) => handleAddressChange('line1', e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>City</Label>
            <Input
              value={formData.address.city}
              onChange={(e) => handleAddressChange('city', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>State</Label>
            <Input
              value={formData.address.state}
              onChange={(e) => handleAddressChange('state', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Postal Code</Label>
          <Input
            value={formData.address.postal_code}
            onChange={(e) => handleAddressChange('postal_code', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? 'Update Contact' : 'Add Contact'}
        </Button>
      </div>
    </form>
  );
}