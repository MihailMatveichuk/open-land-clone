'use client';

import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { PropsWithChildren, useContext, useEffect } from 'react';
import Launcher from '../dashboard/components/Launcher';
import { RegisterContextProvider } from '@/context/RegisterContext';

const Layout = ({ children }: PropsWithChildren) => {
  const { currentUser } = useContext(AuthContext);
  const { push } = useRouter();

  const ProtectedRoute: React.FC<PropsWithChildren> = ({ children }) => {
    if (currentUser === undefined) {
      return <Launcher />;
    } else if (currentUser) {
      push('/dashboard/main');
    }
    return <>{children}</>;
  };

  return (
    <ProtectedRoute>
      <RegisterContextProvider>{children}</RegisterContextProvider>
    </ProtectedRoute>
  );
};

export default Layout;
