'use client';

import Launcher from '@/components/Launcher';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { push } = useRouter();
  setTimeout(() => push('/auth'), 1000);

  return (
    <main>
      <Launcher />
    </main>
  );
}
