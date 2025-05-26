"use server";

// This is a simplified login action for demonstration purposes.
// In a real application, you would use a proper authentication system.
export async function loginAction(username: string, password: string): Promise<{ success: boolean; error?: string }> {
  // Hardcoded credentials for demonstration
  const DEMO_USERNAME = 'admin';
  const DEMO_PASSWORD = '123456';

  if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
    return { success: true };
  } else {
    return { success: false, error: 'Invalid username or password.' };
  }
}
