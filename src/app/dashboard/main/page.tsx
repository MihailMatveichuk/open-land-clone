'use client';

import UserInfo from './components/UserInfo';
import '../../globals.scss';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../../firebase';
import { useRouter } from 'next/navigation';
import Launcher from '../components/Launcher';

const MainPage = () => {
  const [currentUser] = useAuthState(auth);
  const router = useRouter();

  if (currentUser === undefined) {
    return <Launcher />;
  } else if (currentUser === null) {
    router.push('/');
  } else {
    return <UserInfo userUid={currentUser!.uid} isMain />;
  }
};

export default MainPage;
