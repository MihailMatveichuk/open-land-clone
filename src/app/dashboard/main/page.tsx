'use client';

import UserInfo from './components/UserInfo';
import '../../globals.scss';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../../firebase';

const MainPage = () => {
  const [currentUser] = useAuthState(auth);

  return <UserInfo userUid={currentUser!.uid} isMain />;
};

export default MainPage;
