import { useState } from 'react';
import { useMonite } from '@/contexts/MoniteContext';
import { useToast } from '@/hooks/use-toast';
import type { EntityResponse, CreateEntityRequest, UpdateEntityRequest } from '@monite/sdk-api';
import {
  createEntity,
  getEntityDetails,
  updateEntitySettings,
  listEntities,
  deleteEntity
} from '@/lib/monite/entity';

export function useEntity() {
  const { monite } = useMonite();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const create = async (data: CreateEntityRequest): Promise<EntityResponse | null> => {
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
      const entity = await createEntity(data);
      toast({
        title: 'Success',
        description: 'Entity created successfully',
      });
      return entity;
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create entity',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const get = async (): Promise<EntityResponse | null> => {
    if (!monite) return null;

    setLoading(true);
    try {
      return await getEntityDetails();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch entity details',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const update = async (
    entityId: string,
    data: UpdateEntityRequest
  ): Promise<EntityResponse | null> => {
    if (!monite) return null;

    setLoading(true);
    try {
      const entity = await updateEntitySettings(entityId, data);
      toast({
        title: 'Success',
        description: 'Entity settings updated successfully',
      });
      return entity;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update entity settings',
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
  }): Promise<EntityResponse[]> => {
    if (!monite) return [];

    setLoading(true);
    try {
      return await listEntities(params);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch entities',
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const remove = async (entityId: string): Promise<boolean> => {
    if (!monite) return false;

    setLoading(true);
    try {
      await deleteEntity(entityId);
      toast({
        title: 'Success',
        description: 'Entity removed successfully',
      });
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove entity',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    create,
    get,
    update,
    list,
    remove,
    loading
  };
}