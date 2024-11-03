import { createContext, useContext, useEffect, useState } from 'react';
import { MoniteSDK } from '@monite/sdk-api';
import { initializeMoniteSDK, clearMoniteSDK } from '@/lib/monite/config';
import { useToast } from '@/hooks/use-toast';

interface MoniteContextType {
  monite: MoniteSDK | null;
  isInitializing: boolean;
  error: Error | null;
  initialize: () => Promise<MoniteSDK | null>;
}

const MoniteContext = createContext<MoniteContextType>({
  monite: null,
  isInitializing: true,
  error: null,
  initialize: async () => null,
});

export function MoniteProvider({ children }: { children: React.ReactNode }) {
  const [monite, setMonite] = useState<MoniteSDK | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const initialize = async () => {
    if (monite) {
      return monite;
    }

    try {
      setIsInitializing(true);
      setError(null);

      const sdk = await initializeMoniteSDK();
      
      if (!sdk) {
        throw new Error('SDK initialization returned null');
      }

      setMonite(sdk);
      return sdk;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize Monite';
      console.error('Monite initialization error:', err);
      
      setError(err instanceof Error ? err : new Error(errorMessage));
      
      toast({
        variant: 'destructive',
        title: 'Initialization Error',
        description: errorMessage
      });
      
      return null;
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const sdk = await initialize();
        if (mounted && sdk) {
          setMonite(sdk);
        }
      } catch (error) {
        if (mounted) {
          console.error('Initialization error:', error);
        }
      }
    };

    init();

    return () => {
      mounted = false;
      clearMoniteSDK();
    };
  }, []);

  return (
    <MoniteContext.Provider value={{ monite, isInitializing, error, initialize }}>
      {children}
    </MoniteContext.Provider>
  );
}

export function useMonite() {
  const context = useContext(MoniteContext);
  if (context === undefined) {
    throw new Error('useMonite must be used within a MoniteProvider');
  }
  return context;
}