'use client';

import Launcher from '@/app/dashboard/components/Launcher';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';

export default function Home() {
  const { currentUser } = useContext(AuthContext);
  const { push } = useRouter();

  console.log(currentUser);

  if (currentUser === undefined) {
    return <Launcher />;
  } else if (currentUser === null) {
    push('/auth');
  } else {
    push('/dashboard/main');
  }
  return <main></main>;
}
