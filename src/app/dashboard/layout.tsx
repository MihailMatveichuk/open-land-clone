'use client';

import { Inter } from 'next/font/google';
import Leftsidebar from '@/app/dashboard/components/LeftsideBar';
import { ChatContextProvider } from '@/context/Chatcontext';
import { PropsWithChildren, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Launcher from './components/Launcher';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = useContext(AuthContext);
  const { push } = useRouter();

  const ProtectedRoute: React.FC<PropsWithChildren> = ({ children }) => {
    if (currentUser === undefined) {
      return <Launcher />;
    }
    if (currentUser === null) {
      push('/auth');
    }
    return <>{children}</>;
  };

  return (
    <html lang="en">
      <body
        style={{
          display: 'flex',
          height: '100vh',
        }}
      >
        <ChatContextProvider>
          <ProtectedRoute>
            <Leftsidebar />
            {children}
          </ProtectedRoute>
        </ChatContextProvider>
      </body>
    </html>
  );
}
