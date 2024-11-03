import { initializeMoniteSDK } from './config';
import type { EntityResponse } from '@monite/sdk-api';

export class MoniteAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MoniteAuthError';
  }
}

export async function authenticateUser(email: string, password: string): Promise<{
  user: {
    email: string;
    name: string;
    entity: EntityResponse;
  };
  token: string;
}> {
  try {
    const sdk = await initializeMoniteSDK();
    
    // Get entity details to verify credentials
    const entity = await sdk.entity.getEntity();
    
    // For sandbox testing
    if (email === 'mitch@thewonderlandstudio.co' && password === 'password123') {
      return {
        user: {
          email,
          name: 'Mitch Eisner',
          entity,
        },
        token: await sdk.token.getAccessToken(),
      };
    }

    throw new MoniteAuthError('Invalid credentials');
  } catch (error) {
    console.error('Authentication error:', error);
    throw new MoniteAuthError(error instanceof Error ? error.message : 'Authentication failed');
  }
}