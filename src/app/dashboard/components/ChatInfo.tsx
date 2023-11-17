'use client';

import { doc, DocumentData, onSnapshot } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { db } from '../../../../firebase';
import { getLastSeenText } from '@/utlis/lastSeen';
import Avatar from '../../../../public/assets/images/logo.png';
import { IoPersonAddOutline } from 'react-icons/io5';
import { SlCallEnd } from 'react-icons/sl';
import { CiMenuKebab } from 'react-icons/ci';
import Image from 'next/image';

export type ChatInfoProps = {
  userRef: string;
  chatId: string;
};

const ChatInfo: React.FC<ChatInfoProps> = ({ userRef, chatId }) => {
  const [user, setUser] = useState<DocumentData | null>(null);
  const getData = async () => {
    const unsub = onSnapshot(doc(db, 'users', userRef), async (d) => {
      if (d && d.data()) {
        const data = d.data();

        if (data) {
          setUser(data);
        }
      }
    });
    return () => {
      unsub();
    };
  };
  useEffect(() => {
    getData();
  }, [chatId]);

  return (
    <div className="chat-info">
      <div className="container">
        <div className="chat-info__inner">
          <div className="chat-info__description">
            <Image
              src={user?.photoURL || Avatar}
              width={30}
              height={30}
              alt=""
            />
            <div className="chat-info__name-container">
              <span className="chat-info__name">
                {user?.displayName || user?.email}
              </span>
              <span className="chat-info__online">
                {user?.online ? 'online' : getLastSeenText(user?.lastSeen)}
              </span>
            </div>
          </div>
          <div className="chat-icons">
            <IoPersonAddOutline className="chat-icons__icon" />
            <SlCallEnd className="chat-icons__icon" />
            <CiMenuKebab className="chat-icons__icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInfo;
