import { doc, DocumentData, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../../../firebase';
import Avatar from '../../../../public/assets/images/logo.png';
import Image from 'next/image';
import Link from 'next/link';

type ChatCardProps = {
  chat: DocumentData;
  handleSelect: ({ uid, user }: { uid: string; user: string }) => void;
};

const ChatCard: React.FC<ChatCardProps> = (
  { chat, handleSelect },
  { searchParams }
) => {
  const [user, setUser] = useState<DocumentData | null>(null);
  const getData = async () => {
    const unsub = onSnapshot(doc(db, 'users', chat.memberId), async (d) => {
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
  }, []);

  return (
    <li
      className="user-chat"
      key={chat.uid}
      onClick={() =>
        handleSelect({
          uid: chat.uid,
          user: user!.uid,
        })
      }
      role="presentation"
    >
      <Link
        href={{
          pathname: `/dashboard/chats/`,
          query: {
            ...searchParams,
            uid: user?.uid,
          },
        }}
      >
        {user && (
          <div className="container">
            <div className="user-chat__inner">
              <div className="user-chat__img-wrapper">
                <Image
                  className="user-chat__img"
                  src={user.photoURL || Avatar}
                  alt=""
                  width={50}
                  height={50}
                />
                {user.online && <div className="user-chat__online"></div>}
              </div>

              <div className="user-chat__message">
                <span> {user.displayName.trim() || user.email}</span>
                <div>
                  {chat.lastMessage?.length > 20
                    ? chat.lastMessage.slice(1, 20) + '...'
                    : chat.lastMessage}
                </div>
              </div>
            </div>
          </div>
        )}
      </Link>
    </li>
  );
};

export default ChatCard;
