'use client';

import { getDownloadURL, ref, listAll } from 'firebase/storage';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { ChatContext } from '@/context/Chatcontext';
import { db, storage } from '../../../../firebase';
import { IMessageProp } from '../../../../types';
import { ColorRing } from 'react-loader-spinner';
import Like from '../../../../public/assets/images/Like.png';
import Dislike from '../../../../public/assets/images/Dislike.png';
import Image, { StaticImageData } from 'next/image';
import { getExtension } from '@/utlis/getExtension';
import { checkUser } from '../../../../api/seed';
import Avatar from '../../../../public/assets/images/logo.png';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import Link from 'next/link';

const Message = ({ message }: IMessageProp) => {
  const { currentUser } = useContext(AuthContext);
  const [listUrl, setListUrl] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { data } = useContext(ChatContext);
  const [photo, setPhoto] = useState<string | StaticImageData>(message.img);

  const messageExst = getExtension(message.text);
  const date = message.date.toDate().toLocaleString();
  const imageListRef = ref(storage, `images/${data.chatId}`);

  const getPhoto = async () => {
    if (message.senderId !== currentUser!.uid) {
      const user = await checkUser(message.senderId);
      setPhoto(user!.photoURL || Avatar);
    } else {
      setPhoto(currentUser!.photoURL || Avatar);
    }
  };

  useEffect(() => {
    getPhoto();
  }, []);

  const likeHandler = async () => {
    if (message.senderId != currentUser?.uid) {
      const liked = !message.like;
      const docRefMessages = doc(db, 'messages', data.chatId!);
      const id = message.id;
      const docSnapMessages = await getDoc(docRefMessages);
      if (docSnapMessages.exists()) {
        const messages = [...docSnapMessages.data().messages];
        const index = messages.findIndex((message) => message.id === id);
        messages[index] = {
          ...messages[index],
          like: liked,
        };
        await updateDoc(docRefMessages, {
          messages,
        });
      }
    }
  };

  // onSnapshot(doc(db, 'users', data.user), async (d) => {
  //   if (d && d.data()) {
  //     const data = d.data();
  //     if (data) {
  //       setUser(data);
  //     }
  //   }
  // });

  const dislikeHandler = async () => {
    if (message.senderId != currentUser?.uid) {
      const disliked = !message.dislike;
      const docRefMessages = doc(db, 'messages', data.chatId!);
      const id = message.id;
      const docSnapMessages = await getDoc(docRefMessages);
      if (docSnapMessages.exists()) {
        const messages = [...docSnapMessages.data().messages];
        const index = messages.findIndex((message) => message.id === id);
        messages[index] = {
          ...messages[index],
          dislike: disliked,
        };
        await updateDoc(docRefMessages, {
          messages,
        });
      }
    }
  };

  useEffect(() => {
    if (messageExst === 'img' && !loading) {
      setLoading(true);
    }
    listAll(imageListRef).then((res) => {
      res.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setListUrl((prev) => [...prev, url]);
        });
      });
    });
  }, []);

  const onImgLoadHandler = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    if (e.currentTarget.complete) {
      setLoading(false);
    }
  };

  const imgSrc = listUrl.find((item) => {
    const text = encodeURI(message.text).replaceAll(',', '%2C');
    return item.includes(text || text.replaceAll(/ /g, '%'));
  });

  const videoSrc = listUrl.find((item) => {
    const path = encodeURI(message.text).replaceAll(',', '%2C');
    return item.includes(path);
  });
  const audioSrc = listUrl.find((item) => item.includes(message.text));

  return (
    <li
      className={`message ${
        message.senderId === currentUser?.uid ? 'owner' : 'sender'
      }`}
    >
      <div className="message__user-photo">
        <Link href="/dashboard/main">
          <Image width={20} height={20} src={photo!} alt="" />
        </Link>
      </div>
      <div className="message-content">
        <span style={{ fontSize: '14px', fontWeight: 700 }}>
          {message.img && <img src={message.img} alt="" />}
        </span>
        <div className="message-info">
          <div className="message-info-time">{date}</div>
        </div>
        {loading && <ColorRing />}
        <span className="message-text">
          {messageExst === 'video' && (
            <video width="400px" src={videoSrc} controls>
              <track
                src={videoSrc}
                kind="captions"
                srcLang="en"
                label="English"
              ></track>
            </video>
          )}
          {messageExst === 'img' && (
            <img
              className="message__img"
              src={imgSrc}
              alt=""
              onLoad={onImgLoadHandler}
            />
          )}
          {messageExst === 'url' && (
            <a href={message.text} target="_blank" rel="noreferrer">
              message.text
            </a>
          )}
          {messageExst === 'audio' && (
            <div className="audio-player">
              <audio src={audioSrc} controls>
                <track kind="captions" />
              </audio>
            </div>
          )}
          {messageExst === 'text' && message.text}
        </span>
        {/* <div className="reaction">
          <Image
            className="dislike"
            src={Dislike}
            onClickCapture={dislikeHandler}
            alt=""
          />
          <span className="post__like__counter">{message.dislike ? 1 : 0}</span>
          <Image
            style={{ width: '25px' }}
            src={Like}
            onClickCapture={likeHandler}
            alt=""
          />
          <span className="post__like__counter">{message.like ? 1 : 0}</span>
        </div> */}
      </div>
    </li>
  );
};

export default Message;
