import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { account } from '../constant/appwrite';

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the current user instead of session
        const user = await account.get();
        if (user) {
          router.push('/');
        } else {
          router.push('/login?error=authentication_failed');
        }
      } catch (error) {
        console.error('Callback error:', error);
        router.push('/login?error=authentication_failed');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Completing authentication...</h2>
    </div>
  );
} 