'use client';

import { useRouter } from 'next/navigation';
import Leftsidebar from '@/app/dashboard/components/LeftsideBar';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import { PropsWithChildren, useEffect, useState } from 'react';
import Launcher from './components/Launcher';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebase';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [status, setStatus] = useState('');
  const url = `http://localhost:3000${pathname}`;
  const { push } = useRouter();
  const [currentUser] = useAuthState(auth);

  const ProtectedRoute: React.FC<PropsWithChildren> = ({ children }) => {
    if (currentUser === undefined) {
      return <Launcher />;
    }
    if (currentUser === null) {
      push('/auth');
    }
    return <>{children}</>;
  };

  useEffect(() => {
    axios.get(url).then((data) => {
      setStatus(data.statusText);
    });
  }, [url]);

  console.log(currentUser);

  return (
    <html lang="en">
      <body
        style={{
          display: 'flex',
          height: '100vh',
        }}
      >
        <ProtectedRoute>
          {status == 'OK' ? (
            <>
              <Leftsidebar />
              {children}
            </>
          ) : (
            <Launcher />
          )}
        </ProtectedRoute>
      </body>
    </html>
  );
}
