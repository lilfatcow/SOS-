import { MoniteSDK } from '@monite/sdk-api';

interface MoniteConfig {
  apiUrl: string;
  entityId: string;
  clientId: string;
  clientSecret: string;
  apiVersion: string;
}

export const MONITE_CONFIG: MoniteConfig = {
  apiUrl: 'https://api.sandbox.monite.com/v1',
  clientId: 'c8eb06b3-706e-4f71-8c7c-38b9dcd16d0f',
  clientSecret: '3157626c-e99d-47ba-8be9-a06d538c5df5',
  entityId: 'ba266696-5613-4cb7-9d3c-d48cd8181c8f',
  apiVersion: '2024-01-31'
};

let moniteInstance: MoniteSDK | null = null;
let tokenData: { token: string; expiresAt: number } | null = null;

async function fetchToken(): Promise<string> {
  try {
    // Return existing token if it's still valid (with 1-minute buffer)
    if (tokenData && tokenData.expiresAt > Date.now() + 60000) {
      return tokenData.token;
    }

    const response = await fetch(`${MONITE_CONFIG.apiUrl}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-monite-version': MONITE_CONFIG.apiVersion
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: MONITE_CONFIG.clientId,
        client_secret: MONITE_CONFIG.clientSecret
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Token fetch failed: ${response.status} ${response.statusText} ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    if (!data.access_token) {
      throw new Error('No access token received from server');
    }

    // Store token with expiration (converting expires_in to milliseconds)
    tokenData = {
      token: data.access_token,
      expiresAt: Date.now() + ((data.expires_in || 1800) * 1000) - 60000 // 1-minute buffer
    };

    return data.access_token;
  } catch (error) {
    console.error('Token fetch error:', error);
    throw error;
  }
}

export async function initializeMoniteSDK(): Promise<MoniteSDK> {
  try {
    if (moniteInstance) {
      return moniteInstance;
    }

    const token = await fetchToken();
    
    if (!token) {
      throw new Error('Failed to obtain access token');
    }

    moniteInstance = new MoniteSDK({
      fetchToken: async () => token,
      entityId: MONITE_CONFIG.entityId,
      apiUrl: MONITE_CONFIG.apiUrl
    });

    // Verify SDK is properly initialized
    await moniteInstance.waitForReady();
    
    // Verify we can access the API
    const entity = await moniteInstance.entity.getEntity();
    
    if (!entity || !entity.id) {
      throw new Error('Failed to verify entity access');
    }

    return moniteInstance;
  } catch (error) {
    moniteInstance = null;
    tokenData = null;
    console.error('Monite SDK initialization failed:', error);
    throw error;
  }
}

export function getMoniteInstance(): MoniteSDK {
  if (!moniteInstance) {
    throw new Error('Monite SDK not initialized');
  }
  return moniteInstance;
}

export function clearMoniteSDK(): void {
  moniteInstance = null;
  tokenData = null;
}