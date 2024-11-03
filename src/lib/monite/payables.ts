import { getMoniteInstance } from './config';
import type { 
  PayableResponse, 
  CreatePayableRequest,
  UpdatePayableRequest,
  DocumentResponse
} from '@monite/sdk-api';

export class MonitePayablesError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MonitePayablesError';
  }
}

export async function createPayable(data: CreatePayableRequest): Promise<PayableResponse> {
  try {
    const monite = getMoniteInstance();
    const payable = await monite.payables.create(data);
    return payable;
  } catch (error) {
    throw new MonitePayablesError('Failed to create payable');
  }
}

export async function uploadDocument(file: File): Promise<DocumentResponse> {
  try {
    const monite = getMoniteInstance();
    const formData = new FormData();
    formData.append('file', file);
    
    const document = await monite.documents.upload(formData);
    return document;
  } catch (error) {
    throw new MonitePayablesError('Failed to upload document');
  }
}

export async function processDocument(documentId: string): Promise<PayableResponse> {
  try {
    const monite = getMoniteInstance();
    const result = await monite.documents.process(documentId);
    return result;
  } catch (error) {
    throw new MonitePayablesError('Failed to process document');
  }
}

export async function getPayable(id: string): Promise<PayableResponse> {
  try {
    const monite = getMoniteInstance();
    const payable = await monite.payables.getById(id);
    return payable;
  } catch (error) {
    throw new MonitePayablesError('Failed to fetch payable');
  }
}

export async function updatePayable(id: string, data: UpdatePayableRequest): Promise<PayableResponse> {
  try {
    const monite = getMoniteInstance();
    const payable = await monite.payables.update(id, data);
    return payable;
  } catch (error) {
    throw new MonitePayablesError('Failed to update payable');
  }
}

export async function listPayables(params?: {
  limit?: number;
  offset?: number;
  status?: string;
}): Promise<PayableResponse[]> {
  try {
    const monite = getMoniteInstance();
    const payables = await monite.payables.getList(params);
    return payables.data;
  } catch (error) {
    throw new MonitePayablesError('Failed to fetch payables');
  }
}