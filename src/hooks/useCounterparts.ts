import { useState } from 'react';
import { useMonite } from '@/contexts/MoniteContext';
import { useToast } from '@/components/ui/use-toast';
import type { CounterpartResponse, CreateCounterpartRequest } from '@monite/sdk-api';

export function useCounterparts() {
  const { monite } = useMonite();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const create = async (data: CreateCounterpartRequest): Promise<CounterpartResponse | null> => {
    if (!monite) {
      toast({
        title: 'Error',
        description: 'Monite SDK not initialized',
        variant: 'destructive',
      });
      return null;
    }

    setLoading(true);
    try {
      const counterpart = await monite.counterparts.create(data);
      toast({
        title: 'Success',
        description: 'Contact added successfully',
      });
      return counterpart;
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add contact',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const list = async (params?: {
    limit?: number;
    offset?: number;
    type?: 'individual' | 'organization';
  }): Promise<CounterpartResponse[]> => {
    if (!monite) return [];

    setLoading(true);
    try {
      const response = await monite.counterparts.getList(params);
      return response.data;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch contacts',
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, data: Partial<CounterpartResponse>): Promise<CounterpartResponse | null> => {
    if (!monite) return null;

    setLoading(true);
    try {
      const counterpart = await monite.counterparts.update(id, data);
      toast({
        title: 'Success',
        description: 'Contact updated successfully',
      });
      return counterpart;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update contact',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string): Promise<boolean> => {
    if (!monite) return false;

    setLoading(true);
    try {
      await monite.counterparts.delete(id);
      toast({
        title: 'Success',
        description: 'Contact removed successfully',
      });
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove contact',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getById = async (id: string): Promise<CounterpartResponse | null> => {
    if (!monite) return null;

    setLoading(true);
    try {
      return await monite.counterparts.getById(id);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch contact details',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    create,
    list,
    update,
    remove,
    getById,
    loading
  };
}