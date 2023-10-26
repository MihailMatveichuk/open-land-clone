'use client';

import Launcher from '@/app/dashboard/components/Launcher';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

export default function Home() {
  const [user] = useAuthState(auth);
  const { push } = useRouter();
  setTimeout(() => push('/auth'), 1000);

  console.log(user);

  const checkUser = () => {
    if (!user) {
      return;
    } else if (user == null) {
      push('/auth');
    } else {
      push('/dashboard');
    }
  };

  return (
    <main>
      <Launcher />
    </main>
  );
}
