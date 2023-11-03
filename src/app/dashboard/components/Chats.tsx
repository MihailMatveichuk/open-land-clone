'use client';

import { Key, useContext } from 'react';
// import { db, storage } from '../firebase';
// import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '@/context/Chatcontext';
import { ActionType, authUser } from '../../../../types';
import { ColorRing } from 'react-loader-spinner';
import {
  // collection,
  // query,
  // where,
  // getDocs,
  // setDoc,
  // updateDoc,
  // doc,
  // serverTimestamp,
  // onSnapshot,
  // getDoc,
  DocumentData,
} from 'firebase/firestore';
import Loading from './Loading';
import ChatCard from './ChatCard';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
};

const Chats: React.FC<ChatsProps> = ({
  chats,
  users,
  loading,
  onUserSelect,
}) => {
  const { dispatch } = useContext(ChatContext);
  const { push } = useRouter();

  const handleSelect = (u: any) => {
    dispatch({ type: ActionType.ChangeUser, payload: u });
  };

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
              <div className="container">
                <div className="user-chat__inner">
                  {user.photoURL ? (
                    <img
                      className="user-chat__img"
                      src={user.photoURL}
                      alt="hi"
                    />
                  ) : (
                    <Image
                      className="user-chat__img"
                      src="/public/assets/images/Avatar.png"
                      width={50}
                      height={50}
                      alt="hi"
                    />
                  )}
                  <div className="user-chat__message">
                    <span>{user.displayName}</span>
                    <div></div>
                  </div>
                </div>
              </div>
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
    </div>
  );
};

export default Chats;
