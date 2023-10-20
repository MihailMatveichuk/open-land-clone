'use client';

import { doc, DocumentData, onSnapshot } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { db } from '../../../../firebase';
import { getLastSeenText } from '@/utlis/lastSeen';
import Avatar from '../../../../public/assets/images/Avatar.png';
import Image from 'next/image';

export type ChatInfoProps = {
  userRef: string;
  chatId: string;
};

const ChatInfo: React.FC<ChatInfoProps> = ({ userRef, chatId }) => {
  // const [user, setUser] = useState<DocumentData | null>(null);
  // const getData = async () => {
  //   const unsub = onSnapshot(doc(db, 'users', userRef), async (d) => {
  //     if (d && d.data()) {
  //       const data = d.data();

  //       if (data) {
  //         setUser(data);
  //       }
  //     }
  //   });
  //   return () => {
  //     unsub();
  //   };
  // };
  // useEffect(() => {
  //   getData();
  // }, [chatId]);

  return (
    <div className="chat-info">
      <div className="container">
        <div className="chat-info__inner">
          <div className="chat-info__description">
            <Image src={Avatar} alt="" />
            <div className="chat-info__name-container">
              <span className="chat-info__name">Name</span>
              <span className="chat-info__online">
                {/* {user.online ? 'online' : getLastSeenText(user.lastSeen)} */}
              </span>
            </div>
          </div>
          <div className="chatIcons">
            {/* <img src={Add} alt="" />
          <img src={Call} alt="" />
          <img src={Menu} alt="" /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInfo;
