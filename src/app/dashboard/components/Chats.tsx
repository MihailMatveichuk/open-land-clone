'use client';

import { Key, useContext, useEffect, useState } from 'react';
import { db, storage } from '../../../../firebase';
import { AuthContext } from '@/context/AuthContext';
import { ChatContext } from '@/context/Chatcontext';
import { ActionType, authUser } from '../../../../types';
import { ColorRing } from 'react-loader-spinner';
import Button from '@mui/material/Button';
import { AiOutlineCloudDownload } from 'react-icons/ai';
import { useSearchParams } from 'next/navigation';
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  updateDoc,
  doc,
  serverTimestamp,
  onSnapshot,
  getDoc,
  DocumentData,
} from 'firebase/firestore';
import Loading from './Loading';
import ChatCard from './ChatCard';
import Image from 'next/image';
import Link from 'next/link';
const Avatar = require('../../../../public/assets/images/logo.png');

{
  <ColorRing
    visible={true}
    height="50"
    width="50"
    ariaLabel="blocks-loading"
    wrapperStyle={{}}
    wrapperClass="blocks-wrapper"
    colors={['#b8c480', '#B2A3B5', '#F4442E', '#51E5FF', '#429EA6']}
  />;
}

type ChatsProps = {
  chats: DocumentData | undefined;
  users: DocumentData | undefined;
  loading: boolean;
  onUserSelect: (user: authUser) => void;
  userUid: DocumentData | null;
};

const Chats: React.FC<ChatsProps> = (
  { chats, users, loading, onUserSelect, userUid },
  { searchParams }
) => {
  const { dispatch } = useContext(ChatContext);
  const [isUser, setIsUser] = useState<boolean>(true);

  const handleSelect = (u: any) => {
    dispatch({ type: ActionType.ChangeUser, payload: u });
  };

  useEffect(() => {
    if (users?.length < 10) {
      setIsUser(false);
    } else {
      setIsUser(true);
    }
  }, [users?.length]);

  return (
    <div className="chats">
      {loading && <Loading />}
      <ul className="chats__list">
        {users != undefined &&
          users.map((user: authUser) => (
            <li
              className="user-chat"
              key={user.uid}
              onClick={() => onUserSelect(user)}
              role="presentation"
            >
              <Link
                href={{
                  pathname: '/dashboard/users',
                  query: {
                    ...searchParams,
                    uid: user.uid,
                  },
                }}
              >
                <div className="container">
                  <div className="user-chat__inner">
                    {user.photoURL ? (
                      <Image
                        width={50}
                        height={50}
                        className="user-chat__img"
                        src={user.photoURL}
                        alt="User Photo"
                      />
                    ) : (
                      <Image
                        className="user-chat__img"
                        src={Avatar}
                        width={50}
                        height={50}
                        alt="User Photo"
                      />
                    )}
                    <div className="user-chat__message">
                      <span>{user.displayName.trim() || user.email}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        {chats != undefined &&
          chats
            ?.sort(
              (a: { date: number }, b: { date: number }) => b.date - a.date
            )
            .map((chat: DocumentData, i: Key | null | undefined) => (
              <ChatCard
                handleSelect={handleSelect}
                chat={chat}
                key={chat.uid}
              />
            ))}
      </ul>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '1rem',
        }}
      ></div>
    </div>
  );
};

export default Chats;
