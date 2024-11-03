import { getMoniteInstance } from './config';
import type { 
  BankAccountResponse,
  CreateBankAccountRequest,
  UpdateBankAccountRequest
} from '@monite/sdk-api';

export class MoniteBankingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MoniteBankingError';
  }
}

export async function createBankAccount(data: CreateBankAccountRequest): Promise<BankAccountResponse> {
  try {
    const monite = getMoniteInstance();
    const account = await monite.bankAccounts.create(data);
    return account;
  } catch (error) {
    throw new MoniteBankingError('Failed to create bank account');
  }
}

export async function getBankAccount(id: string): Promise<BankAccountResponse> {
  try {
    const monite = getMoniteInstance();
    const account = await monite.bankAccounts.getById(id);
    return account;
  } catch (error) {
    throw new MoniteBankingError('Failed to fetch bank account');
  }
}

export async function listBankAccounts(): Promise<BankAccountResponse[]> {
  try {
    const monite = getMoniteInstance();
    const accounts = await monite.bankAccounts.getList();
    return accounts.data;
  } catch (error) {
    throw new MoniteBankingError('Failed to fetch bank accounts');
  }
}

export async function updateBankAccount(
  id: string, 
  data: UpdateBankAccountRequest
): Promise<BankAccountResponse> {
  try {
    const monite = getMoniteInstance();
    const account = await monite.bankAccounts.update(id, data);
    return account;
  } catch (error) {
    throw new MoniteBankingError('Failed to update bank account');
  }
}

export async function deleteBankAccount(id: string): Promise<void> {
  try {
    const monite = getMoniteInstance();
    await monite.bankAccounts.delete(id);
  } catch (error) {
    throw new MoniteBankingError('Failed to delete bank account');
  }
}