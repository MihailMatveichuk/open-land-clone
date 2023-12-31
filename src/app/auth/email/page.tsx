'use client';

import { useContext, useState } from 'react';
import {
  browserSessionPersistence,
  signInWithEmailAndPassword,
  setPersistence,
  // UserCredential,
  createUserWithEmailAndPassword,
  // GoogleAuthProvider,
  // signInWithPopup,
  // updateProfile,
} from 'firebase/auth';
import { auth } from '../../../../firebase';
import { checkUser, createUserViaEmail, loginUser } from '../../../../api/seed';
import FormLayout from '../components/FormLayout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const AuthEmail = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { push } = useRouter();

  const login = async () => {
    try {
      await setPersistence(auth, browserSessionPersistence);
      const res = await signInWithEmailAndPassword(auth, email, password);
      await loginUser(res.user.uid);
      push('/dashboard/main');
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmitHandlerEmail = async () => {
    try {
      push('/register');
      const user = await createUserWithEmailAndPassword(auth, email, password);
      console.log(user);

      const u = await checkUser(user.user.uid);
      if (!u && user.user.email) {
        await createUserViaEmail({
          email: user.user.email,
          uid: user.user.uid,
        });
      } else {
        push('/dashboard/main');
      }
    } catch (e) {
      const err = e as Error;
      console.log(err.message);

      if (err.message === 'Firebase: Error (auth/email-already-in-use).') {
        await login();
        push('/dashboard/main');
      }
    }
  };
  return (
    <div className="on-boarding">
      <div className="on-boarding__inner">
        <div className="on-boarding__top">
          <Link href="/auth" className="on-boarding__go-back">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_17859_38408)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.2071 2.79289C16.5976 3.18342 16.5976 3.81658 16.2071 4.20711L8.41421 12L16.2071 19.7929C16.5976 20.1834 16.5976 20.8166 16.2071 21.2071C15.8166 21.5976 15.1834 21.5976 14.7929 21.2071L6.29289 12.7071C5.90237 12.3166 5.90237 11.6834 6.29289 11.2929L14.7929 2.79289C15.1834 2.40237 15.8166 2.40237 16.2071 2.79289Z"
                  fill="#71747A"
                />
              </g>
              <defs>
                <clipPath id="clip0_17859_38408">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </Link>
        </div>
        <FormLayout
          title="What’s your email and password?"
          text="Insert your email and password"
          onSubmit={onSubmitHandlerEmail}
        >
          <input
            type="email"
            className="input on-boarding__email"
            required
            placeholder="krambambulia@.com"
            pattern="/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/"
            onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
          <input
            type="password"
            placeholder="Password should be more then 6 symbols"
            className="input on-boarding__password"
            pattern=".{6,}"
            required
            title="Enter a password consisting more then 6 symbols"
            onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
        </FormLayout>
      </div>
    </div>
  );
};

export default AuthEmail;
