'use client';

import InputFile from './components/InputFile';
import { useState, useContext, useEffect } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../../firebase';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getBlob,
} from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { checkUser } from '../../../api/seed';
const logoSrc = require('../../../public/assets/images/Avatar.png');

const Register = () => {
  const { currentUser } = useContext(AuthContext);
  const [isSet, setIsSet] = useState(false);
  const [image, setImage] = useState<string | ArrayBuffer>(logoSrc);
  const { push } = useRouter();

  if (!isSet) {
    redirect('/register');
  }

  const handleSubmit = async (e: {
    target: any;
    preventDefault: () => void;
  }) => {
    e.preventDefault();
    const defaultImage = await getDownloadURL(ref(storage, 'logo.png'));
    const file = e.target[0].files[0];
    const firstName: string = e.target[1].value;
    const lastName: string = e.target[2].value;
    try {
      const displayName = `${firstName} ${lastName}`;
      const storageRef = ref(storage, currentUser!.uid);
      if (file) {
        await uploadBytesResumable(storageRef, file).then(async () => {
          getDownloadURL(storageRef).then(async (downloadURL) => {
            try {
              await updateProfile(currentUser!, {
                displayName,
                photoURL: downloadURL,
              });
              const user = await checkUser(currentUser!.uid);
              await updateDoc(doc(db, 'users', user!.uid), {
                ...user,
                displayName,
                photoURL: downloadURL,
              });
              push('/dashboard/main');
            } catch (err) {
              console.log(err);
              // setError(true);
            }
          });
        });
      } else {
        try {
          await updateProfile(currentUser!, {
            displayName,
            photoURL: defaultImage,
          });
          const user = await checkUser(currentUser!.uid);
          await updateDoc(doc(db, 'users', user!.uid), {
            ...user,
            displayName,
            photoURL: defaultImage,
          });
          push('/dashboard/main');
        } catch (err) {
          console.log(err);
          // setError(true);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <span className="title">Introduce yourself</span>
        <form className="registra-form" onSubmit={handleSubmit}>
          <InputFile
            src={image}
            onChange={(image: string | ArrayBuffer) => setImage(image)}
          />
          <input type="text" placeholder="First name" required />
          <input type="text" placeholder="Last Name" required />
          <button className="btn btn--primary">Go</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
