
import { redirect } from 'next/navigation';

export default function DashboardHomePage() {
  // For now, redirect to inventory as the main starting point
  // This page can be built out later with actual dashboard widgets
  redirect('/inventory');
}
