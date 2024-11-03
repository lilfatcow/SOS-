import { useState } from 'react';
import { useMonite } from '@/contexts/MoniteContext';
import { useToast } from '@/components/ui/use-toast';
import type { BankAccountResponse } from '@monite/sdk-api';

export function useBanking() {
  const { monite } = useMonite();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const create = async (data: any) => {
    if (!monite) return null;
    
    setLoading(true);
    try {
      const account = await monite.bankAccounts.create(data);
      toast({
        title: 'Success',
        description: 'Bank account added successfully',
      });
      return account;
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add bank account',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const list = async (): Promise<BankAccountResponse[]> => {
    if (!monite) return [];
    
    setLoading(true);
    try {
      const response = await monite.bankAccounts.getList();
      return response.data;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch bank accounts',
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string): Promise<boolean> => {
    if (!monite) return false;
    
    setLoading(true);
    try {
      await monite.bankAccounts.delete(id);
      toast({
        title: 'Success',
        description: 'Bank account removed successfully',
      });
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove bank account',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    create,
    list,
    remove,
    loading
  };
}