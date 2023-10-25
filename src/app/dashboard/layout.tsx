'use client';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Leftsidebar from '@/app/dashboard/components/LeftsideBar';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Launcher from './components/Launcher';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [status, setStatus] = useState('');
  const url = `http://localhost:3000${pathname}`;

  useEffect(() => {
    axios.get(url).then((data) => {
      setStatus(data.statusText);
    });
  }, [url]);

  return (
    <html lang="en">
      <body
        style={{
          display: 'flex',
          height: '100vh',
        }}
      >
        {status == 'OK' ? (
          <>
            <Leftsidebar />
            {children}
          </>
        ) : (
          <Launcher />
        )}
      </body>
    </html>
  );
}
