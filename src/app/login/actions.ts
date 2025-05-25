"use server";

import { redirect } from 'next/navigation';

// This is a simplified login action for demonstration purposes.
// In a real application, you would use a proper authentication system.
export async function loginAction(username: string, password: string): Promise<{ success: boolean; error?: string }> {
  // Hardcoded credentials for demonstration
  const DEMO_USERNAME = 'admin';
  const DEMO_PASSWORD = '123456';

  if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
    // In a real app, you would set up a session or token here.
    // For now, we'll just redirect.
    redirect('/dashboard'); 
    // The redirect function throws an error to interrupt rendering, 
    // so a return statement after it for success is not strictly necessary
    // but can be kept for clarity if preferred.
    // return { success: true }; 
  } else {
    return { success: false, error: 'Invalid username or password.' };
  }
}
