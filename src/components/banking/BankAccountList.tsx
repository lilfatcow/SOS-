import { useEffect, useState } from 'react';
import { useBanking } from '@/hooks/useBanking';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BankAccountForm } from './BankAccountForm';
import { BankAccountVerification } from './BankAccountVerification';
import type { BankAccountResponse } from '@monite/sdk-api';

export function BankAccountList() {
  const { list, remove, loading } = useBanking();
  const [accounts, setAccounts] = useState<BankAccountResponse[]>([]);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [verifyingAccount, setVerifyingAccount] = useState<string | null>(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    const data = await list();
    setAccounts(data);
  };

  const handleDelete = async (id: string) => {
    const success = await remove(id);
    if (success) {
      setAccounts(accounts.filter(account => account.id !== id));
    }
  };

  const handleAddSuccess = () => {
    setShowAddAccount(false);
    loadAccounts();
  };

  const handleVerificationSuccess = () => {
    setVerifyingAccount(null);
    loadAccounts();
  };

  if (loading && accounts.length === 0) {
    return (
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="animate-pulse flex items-center gap-4">
              <div className="w-10 h-10 bg-muted rounded-full" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-muted rounded w-1/4" />
                <div className="h-3 bg-muted rounded w-1/3" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <Card className="p-8 bg-white/80 backdrop-blur-lg border border-white/20 shadow-xl">
        <div className="flex items-center justify-center flex-col gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-lg font-medium">Connect Your Bank Account</h2>
          <p className="text-muted-foreground text-center max-w-md">
            Securely connect your bank account to enable payments, transfers, and automated reconciliation.
          </p>
          <Button 
            className="mt-4" 
            onClick={() => setShowAddAccount(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Bank Account
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Connected Bank Accounts</h2>
        <Button onClick={() => setShowAddAccount(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Account
        </Button>
      </div>

      <div className="grid gap-4">
        {accounts.map((account) => (
          <Card key={account.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{account.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {account.bank_name} • ****{account.iban?.slice(-4)}
                  </p>
                </div>
                {account.status === 'verified' ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500 ml-2" />
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-4"
                    onClick={() => setVerifyingAccount(account.id)}
                  >
                    <AlertCircle className="h-4 w-4 mr-2 text-orange-500" />
                    Verify Account
                  </Button>
                )}
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove Bank Account</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove this bank account? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(account.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Remove
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={showAddAccount} onOpenChange={setShowAddAccount}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Bank Account</DialogTitle>
          </DialogHeader>
          <BankAccountForm
            onSuccess={handleAddSuccess}
            onCancel={() => setShowAddAccount(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog 
        open={!!verifyingAccount} 
        onOpenChange={(open) => !open && setVerifyingAccount(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Bank Account</DialogTitle>
          </DialogHeader>
          {verifyingAccount && (
            <BankAccountVerification
              bankAccountId={verifyingAccount}
              onSuccess={handleVerificationSuccess}
              onCancel={() => setVerifyingAccount(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}