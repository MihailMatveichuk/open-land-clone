'use client';

import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
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
import { db } from '../../../../firebase';
import { ActionType } from '../../../../types';
import { ChatContext } from '@/context/Chatcontext';
import { createChat, getChat, checkUser } from '../../../../api/seed';
import Aside from '../components/Aside';
import Chat from '../components/Chat';
import SearchInput from '../components/SearchInput';
import Chats from '../components/Chats';

const ChatPage = ({ params }: { params: { slug: string } }) => {
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const [chats, setChats] = useState<DocumentData | undefined>([]);
  const [filteredChats, setFilteredChats] = useState<DocumentData | undefined>(
    []
  );
  const [err, setError] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const [loading, setLoading] = useState<boolean>(true);

  const gtChats = () => {
    setLoading(true);
    const unsub = onSnapshot(doc(db, 'chats', currentUser!.uid), async (d) => {
      if (d && d.data()) {
        const data = d.data();

        if (data) {
          console.log(data.chats, 'data');
          setChats(data.chats);
          setFilteredChats(data.chats);
        }
      }
      setLoading(false);
    });

    return () => {
      unsub();
    };
  };

  useEffect(() => {
    currentUser?.uid && gtChats();
  }, [currentUser?.uid]);

  const onSearchHandler = async (val: string) => {
    setSearchValue(val);
    setLoading(true);
    setFilteredChats([]);
    const users: DocumentData[] = [];
    const usersInChat = chats!.map((chat: { memberId: any }) => chat.memberId);
    const querySnapshot = await getDocs(
      query(collection(db, 'users'), where('uid', 'in', usersInChat))
    );
    querySnapshot.forEach((doc) => {
      users.push(doc.data());
    });

    if (val === '') {
      setFilteredChats(chats);
      setLoading(false);
    } else {
      const filtered = chats!.filter(
        (chat: { memberId: any; lastMessage: string }) => {
          const user = users.find((user) => user.uid === chat.memberId);

          if (!user) return false;
          return (
            (user.displayName &&
              user.displayName.toLowerCase().includes(val.toLowerCase())) ||
            (chat.lastMessage &&
              chat.lastMessage.toLowerCase().includes(val.toLowerCase()))
          );
        }
      );
      setFilteredChats(filtered);
      setLoading(false);
    }
  };
  const memberId = params.slug;

  useEffect(() => {
    const getChatById = async (uid: string) => {
      const user = await checkUser(uid);
      if (user) {
        await handleSelect(user);
      }
    };
    if (memberId && currentUser) {
      getChatById(memberId);
    }
  }, [memberId]);

  const handleSelect = async (user: DocumentData) => {
    const chat = await getChat(currentUser!.uid, user.uid);
    if (!chat) {
      await createChat(currentUser!.uid, user.uid);
      const newChat = await getChat(currentUser!.uid, user.uid);
      dispatch({
        type: ActionType.ChangeUser,
        payload: {
          user: user.uid,
          uid: newChat[0].uid,
        },
      });
    } else {
      dispatch({
        type: ActionType.ChangeUser,
        payload: {
          user: user.uid,
          uid: chat[0].uid,
        },
      });
    }
  };

  return (
    <>
      <Aside title={'Chats'}>
        <div className="container">
          <SearchInput
            onChange={onSearchHandler}
            placeholder="Chats, messages and more"
            value={searchValue}
          />
        </div>
        <Chats
          chats={filteredChats}
          loading={loading}
          users={undefined}
          onUserSelect={handleSelect}
          userUid={null}
        />
      </Aside>
      <Chat />
    </>
  );
};

export default ChatPage;
