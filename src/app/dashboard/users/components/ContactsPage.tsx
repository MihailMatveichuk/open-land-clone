'use client';

import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import Chats from '../../components/Chats';
import { ChatContext } from '@/context/Chatcontext';
import { collection, doc, DocumentData, onSnapshot } from 'firebase/firestore';
import { db } from '../../../../../firebase';
import { ActionType, authUser } from '../../../../../types';
import { useRouter } from 'next/navigation';
import Aside from '../../components/Aside';
import SearchInput from '../../components/SearchInput';
import UserInfo from '../../main/components/UserInfo';
import { useSearchParams } from 'next/navigation';
import { createChat, getChat } from '../../../../../api/seed';

const ContactsPage = () => {
  const { currentUser } = useContext(AuthContext);
  const { push } = useRouter();
  const { dispatch } = useContext(ChatContext);
  const [users, setUsers] = useState<DocumentData | undefined>([]);
  const [filteredUsers, setFilteredUsers] = useState<DocumentData | undefined>(
    []
  );
  const [chosenUser, setChosenUser] = useState<DocumentData | null>(null);
  const [err, setError] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState('');
  const searchParams = useSearchParams();

  const uid = searchParams.get('uid');

  const gtChats = () => {
    setLoading(true);
    const unsub = onSnapshot(collection(db, 'users'), (querySnapshot) => {
      const ppl: DocumentData[] = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().uid !== currentUser!.uid) {
          ppl.push(doc.data());
        }
      });
      setUsers(ppl);
      setFilteredUsers(ppl);
      setLoading(false);
    });
    return () => {
      unsub();
    };
  };

  const handleSelect = async (user: authUser) => {
    setChosenUser(user);
  };

  const onSearchHandler = (val: string) => {
    setSearchValue(val);
    if (val === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users!.filter((user: any) =>
        user.displayName.toLowerCase().includes(val.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  // const handleSendMessage = async () => {
  const handleSendMessage = async () => {
    if (!uid) {
      return;
    }
    const chat = await getChat(currentUser!.uid, uid);
    if (!chat) {
      await createChat(currentUser!.uid, uid);
      const newChat = await getChat(currentUser!.uid, uid);
      dispatch({
        type: ActionType.ChangeUser,
        payload: {
          user: uid,
          uid: newChat[0].uid,
        },
      });
    } else {
      dispatch({
        type: ActionType.ChangeUser,
        payload: {
          user: uid,
          uid: chat[0].uid,
        },
      });
    }
    // };
    push(`/dashboard/chats?uid=${uid}`);
  };

  useEffect(() => {
    currentUser?.uid && gtChats();
  }, [currentUser?.uid]);

  return (
    <>
      <Aside title={'Users'}>
        <div className="container">
          <SearchInput
            onChange={onSearchHandler}
            value={searchValue}
            placeholder="Find user"
          />
        </div>
        <Chats
          chats={undefined}
          loading={loading}
          users={filteredUsers}
          onUserSelect={handleSelect}
          userUid={chosenUser?.uid}
        />
      </Aside>
      {!uid ? (
        <div>
          <h2>Choice a user</h2>
        </div>
      ) : (
        <UserInfo
          userUid={uid}
          isMain={false}
          onSendMessage={handleSendMessage}
        />
      )}
    </>
  );
};

export default ContactsPage;
