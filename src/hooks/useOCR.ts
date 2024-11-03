import { useState } from 'react';
import { useMonite } from '@/contexts/MoniteContext';
import { useToast } from '@/hooks/use-toast';
import type { PayableResponse } from '@monite/sdk-api';

export function useOCR() {
  const { monite } = useMonite();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000; // 2 seconds

  const processDocument = async (file: File): Promise<PayableResponse | null> => {
    if (!monite) {
      toast({
        title: 'Error',
        description: 'OCR service not initialized',
        variant: 'destructive',
      });
      return null;
    }

    setProcessing(true);
    setRetryCount(0);

    try {
      // Upload document
      const formData = new FormData();
      formData.append('file', file);
      
      const document = await monite.documents.upload(formData);

      if (!document?.id) {
        throw new Error('Failed to upload document');
      }

      // Process document with OCR with retry mechanism
      let processedData: PayableResponse | null = null;
      let currentTry = 0;

      while (currentTry < MAX_RETRIES && !processedData) {
        try {
          processedData = await monite.documents.process(document.id);
          
          if (processedData) {
            toast({
              title: 'Success',
              description: 'Document processed successfully',
            });
            return processedData;
          }
        } catch (error) {
          currentTry++;
          setRetryCount(currentTry);
          
          if (currentTry === MAX_RETRIES) {
            throw new Error(`Failed to process document after ${MAX_RETRIES} attempts`);
          }
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        }
      }

      throw new Error('Failed to process document');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to process document',
        variant: 'destructive',
      });
      return null;
    } finally {
      setProcessing(false);
    }
  };

  return {
    processDocument,
    processing,
    retryCount,
    maxRetries: MAX_RETRIES
  };
}