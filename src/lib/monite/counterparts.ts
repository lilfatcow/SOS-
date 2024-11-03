import { getMoniteInstance } from './config';
import type { 
  CounterpartResponse,
  CreateCounterpartRequest,
  UpdateCounterpartRequest
} from '@monite/sdk-api';

export class MoniteCounterpartsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MoniteCounterpartsError';
  }
}

export async function createCounterpart(data: CreateCounterpartRequest): Promise<CounterpartResponse> {
  try {
    const monite = getMoniteInstance();
    const counterpart = await monite.counterparts.create(data);
    return counterpart;
  } catch (error) {
    throw new MoniteCounterpartsError('Failed to create counterpart');
  }
}

export async function getCounterpart(id: string): Promise<CounterpartResponse> {
  try {
    const monite = getMoniteInstance();
    const counterpart = await monite.counterparts.getById(id);
    return counterpart;
  } catch (error) {
    throw new MoniteCounterpartsError('Failed to fetch counterpart');
  }
}

export async function listCounterparts(params?: {
  limit?: number;
  offset?: number;
  type?: 'individual' | 'organization';
}): Promise<CounterpartResponse[]> {
  try {
    const monite = getMoniteInstance();
    const counterparts = await monite.counterparts.getList(params);
    return counterparts.data;
  } catch (error) {
    throw new MoniteCounterpartsError('Failed to fetch counterparts');
  }
}

export async function updateCounterpart(
  id: string, 
  data: UpdateCounterpartRequest
): Promise<CounterpartResponse> {
  try {
    const monite = getMoniteInstance();
    const counterpart = await monite.counterparts.update(id, data);
    return counterpart;
  } catch (error) {
    throw new MoniteCounterpartsError('Failed to update counterpart');
  }
}

export async function deleteCounterpart(id: string): Promise<void> {
  try {
    const monite = getMoniteInstance();
    await monite.counterparts.delete(id);
  } catch (error) {
    throw new MoniteCounterpartsError('Failed to delete counterpart');
  }
}