
import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect to the new main dashboard page
  redirect('/dashboard'); 
}
