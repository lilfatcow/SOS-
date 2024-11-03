import { useState } from 'react';
import { useMonite } from '@/contexts/MoniteContext';
import { useToast } from '@/hooks/use-toast';

export function useAnalytics() {
  const { monite } = useMonite();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const getPaymentAnalytics = async (params: {
    startDate: Date;
    endDate: Date;
    type?: 'inbound' | 'outbound';
  }) => {
    if (!monite) return null;

    setLoading(true);
    try {
      const analytics = await monite.analytics.getPayments({
        start_date: params.startDate.toISOString(),
        end_date: params.endDate.toISOString(),
        type: params.type
      });

      return analytics;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch payment analytics',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getAuditTrail = async (params: {
    entityId: string;
    startDate?: Date;
    endDate?: Date;
  }) => {
    if (!monite) return [];

    setLoading(true);
    try {
      const response = await monite.audit.getTrail({
        entity_id: params.entityId,
        start_date: params.startDate?.toISOString(),
        end_date: params.endDate?.toISOString()
      });

      return response.data;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch audit trail',
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const exportData = async (params: {
    type: 'payments' | 'invoices' | 'audit';
    format: 'csv' | 'xlsx';
    startDate: Date;
    endDate: Date;
  }) => {
    if (!monite) return null;

    setLoading(true);
    try {
      const response = await monite.exports.create({
        type: params.type,
        format: params.format,
        start_date: params.startDate.toISOString(),
        end_date: params.endDate.toISOString()
      });

      toast({
        title: 'Success',
        description: 'Export started successfully',
      });

      return response;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start export',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getPaymentAnalytics,
    getAuditTrail,
    exportData,
    loading
  };
}