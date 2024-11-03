// Mock credentials for testing
export const TEST_CREDENTIALS = {
  email: 'test@example.com',
  password: 'password123'
};

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export async function mockAuthLogin(email: string, password: string): Promise<void> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (email === TEST_CREDENTIALS.email && password === TEST_CREDENTIALS.password) {
    return; // Success
  }

  throw new AuthError('Invalid email or password');
}