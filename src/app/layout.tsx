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
  const router = useRouter();
  const [currentUser] = useAuthState(auth);

  console.log(currentUser);

  // const ProtectedRoute: React.FC<PropsWithChildren> = ({ children }) => {

  if (currentUser === undefined) {
    return <Launcher />;
  } else if (currentUser === null) {
    router.push('/auth');
  } else {
    router.push('/dashboard/main');
  }

  // };
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>{children}</AuthContextProvider>
      </body>
    </html>
  );
}
