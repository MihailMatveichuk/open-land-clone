'use client';

import { Inter } from 'next/font/google';
import './globals.scss';
import { AuthContextProvider } from '@/context/AuthContext';
import { PropsWithChildren, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import Launcher from './dashboard/components/Launcher';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>{children}</AuthContextProvider>
      </body>
    </html>
  );
}
