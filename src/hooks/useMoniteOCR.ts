import { useState } from 'react';
import { useMonite } from '@/contexts/MoniteContext';
import { useToast } from '@/components/ui/use-toast';

export function useMoniteOCR() {
  const { monite } = useMonite();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);

  const processDocument = async (file: File) => {
    if (!monite) {
      toast({
        title: 'Error',
        description: 'Monite SDK not initialized',
        variant: 'destructive',
      });
      return null;
    }

    setProcessing(true);

    try {
      // Upload document
      const formData = new FormData();
      formData.append('file', file);
      const document = await monite.documents.upload(formData);

      if (!document?.id) {
        throw new Error('Failed to upload document');
      }

      // Process document with OCR
      const processedData = await monite.documents.process(document.id);
      
      return processedData;
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
    processing
  };
}