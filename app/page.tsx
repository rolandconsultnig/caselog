import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import LandingPage from '@/components/LandingPage';

export default async function Home() {
  try {
    const session = await getServerSession(authOptions);

    // If user is logged in, redirect to dashboard
    if (session) {
      redirect('/dashboard');
    }

    // Otherwise, show public landing page
    return <LandingPage />;
  } catch (error) {
    // If there's an error (e.g., database connection), show landing page anyway
    console.error('Error getting session:', error);
    return <LandingPage />;
  }
}

