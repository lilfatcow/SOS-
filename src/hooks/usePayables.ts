import { useState, useCallback } from 'react';
import { useMonite } from '@/contexts/MoniteContext';
import { useToast } from '@/components/ui/use-toast';
import {
  createPayable,
  uploadDocument,
  processDocument,
  getPayable,
  updatePayable,
  listPayables
} from '@/lib/monite/payables';
import type { 
  PayableResponse, 
  CreatePayableRequest,
  UpdatePayableRequest 
} from '@monite/sdk-api';

export function usePayables() {
  const { monite } = useMonite();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleError = (error: Error) => {
    toast({
      title: 'Error',
      description: error.message,
      variant: 'destructive',
    });
  };

  const uploadAndProcess = async (file: File): Promise<PayableResponse | null> => {
    if (!monite) {
      throw new Error('Monite SDK not initialized');
    }

    try {
      setLoading(true);
      
      // Upload document
      const document = await uploadDocument(file);

      if (!document?.id) {
        throw new Error('Failed to upload document');
      }

      // Process document with OCR
      const processedData = await processDocument(document.id);
      
      if (!processedData) {
        throw new Error('Failed to process document');
      }

      return processedData;
    } catch (error) {
      handleError(error instanceof Error ? error : new Error('Failed to process document'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const create = async (data: CreatePayableRequest): Promise<PayableResponse | null> => {
    try {
      setLoading(true);
      return await createPayable(data);
    } catch (error) {
      handleError(error instanceof Error ? error : new Error('Failed to create payable'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const get = async (id: string): Promise<PayableResponse | null> => {
    try {
      setLoading(true);
      return await getPayable(id);
    } catch (error) {
      handleError(error instanceof Error ? error : new Error('Failed to fetch payable'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, data: UpdatePayableRequest): Promise<PayableResponse | null> => {
    try {
      setLoading(true);
      return await updatePayable(id, data);
    } catch (error) {
      handleError(error instanceof Error ? error : new Error('Failed to update payable'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const list = async (params?: {
    limit?: number;
    offset?: number;
    status?: string;
  }): Promise<PayableResponse[]> => {
    try {
      setLoading(true);
      return await listPayables(params);
    } catch (error) {
      handleError(error instanceof Error ? error : new Error('Failed to fetch payables'));
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadAndProcess,
    create,
    get,
    update,
    list,
    loading
  };
}