import { useState } from 'react';
import { useMonite } from '@/contexts/MoniteContext';
import { useToast } from '@/hooks/use-toast';

export function useWorkflows() {
  const { monite } = useMonite();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const createApprovalWorkflow = async (data: {
    name: string;
    steps: Array<{
      type: 'approval' | 'notification';
      approvers?: string[];
      threshold?: number;
    }>;
  }) => {
    if (!monite) return null;

    setLoading(true);
    try {
      const workflow = await monite.workflows.create({
        name: data.name,
        type: 'approval',
        steps: data.steps
      });

      toast({
        title: 'Success',
        description: 'Approval workflow created successfully',
      });

      return workflow;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create approval workflow',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getWorkflows = async () => {
    if (!monite) return [];

    setLoading(true);
    try {
      const response = await monite.workflows.getList();
      return response.data;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch workflows',
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const updateWorkflowStatus = async (workflowId: string, status: 'approved' | 'rejected', comment?: string) => {
    if (!monite) return false;

    setLoading(true);
    try {
      await monite.workflows.updateStatus(workflowId, {
        status,
        comment
      });

      toast({
        title: 'Success',
        description: `Workflow ${status} successfully`,
      });

      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update workflow status',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createApprovalWorkflow,
    getWorkflows,
    updateWorkflowStatus,
    loading
  };
}