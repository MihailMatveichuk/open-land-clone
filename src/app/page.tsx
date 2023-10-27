'use client';

import Launcher from '@/app/dashboard/components/Launcher';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import { useEffect } from 'react';

export default function Home() {
  const [user] = useAuthState(auth);
  const { push } = useRouter();

  console.log(user);

  useEffect(() => {
    if (user == null) {
      push('/auth');
    } else {
      push('/dashboard/main');
    }
  }, []);

  return (
    <main>
      <Launcher />
    </main>
  );
}
