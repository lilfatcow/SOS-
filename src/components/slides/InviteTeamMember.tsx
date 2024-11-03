import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useState } from 'react';

export function InviteTeamMember() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle invitation logic here
    console.log('Inviting:', email);
  };

  return (
    <div className="space-y-6">
      <SheetHeader>
        <SheetTitle>Invite team member</SheetTitle>
        <SheetDescription>
          Add a new team member to your WonderPay workspace.
        </SheetDescription>
      </SheetHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="colleague@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Send invitation
        </Button>
      </form>
    </div>
  );
}