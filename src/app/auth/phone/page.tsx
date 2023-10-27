'use client';

import { useState, useEffect } from 'react';
import {
  browserSessionPersistence,
  setPersistence,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from 'firebase/auth';
import { auth } from '../../../../firebase';
import FormLayout from '../components/FormLayout';
import OtpInput from '../components/OtpInput';
import { checkUser, createUserViaPhone } from '../../../../api/seed';
import { useRouter } from 'next/navigation';

const AuthPhone = () => {
  const [step, setStep] = useState<number>(1);
  const [phone, setPhone] = useState<string>('');
  const [rec, setRec] = useState<RecaptchaVerifier | null>(null);
  const [otp, setOtp] = useState<string>('');
  const [confirmRes, setConfirmRes] = useState<ConfirmationResult | null>(null);
  const { push } = useRouter();

  const onBackClick = () => {
    if (step === 2) {
      setStep(1);
    } else {
      push('/auth');
    }
  };

  useEffect(() => {
    if (step === 1) {
      try {
        setRecaptchaVerifier();
      } catch (e) {
        console.log(e);
      }
    }
  }, []);

  const setRecaptchaVerifier = async () => {
    if (rec) return;
    try {
      const recaptchaVerifier = new RecaptchaVerifier(
        'recaptcha-container',
        {},
        auth
      );
      setRec(recaptchaVerifier);
      await recaptchaVerifier.render();
    } catch (e) {
      if (rec) {
        setRec(null);
        setRecaptchaVerifier();
      }
    }
  };
  const onCodeSubmitHandler = async () => {
    if (!confirmRes) return;
    try {
      await setPersistence(auth, browserSessionPersistence);
      const res = await confirmRes.confirm(otp);
      const user = await checkUser(res.user.uid);
      if (!user) {
        await createUserViaPhone({
          uid: res.user.uid,
          phone: res.user.phoneNumber!,
        });
        push('/register');
      } else {
        push('/dashboard/main');
      }
    } catch (err) {
      console.log('onCodeSubmitHandler', err);
    }
  };

  const changePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const onSignInSubmit = async () => {
    if (phone) {
      try {
        console.log(rec);

        if (!rec) return;
        await setPersistence(auth, browserSessionPersistence);
        const res = await signInWithPhoneNumber(auth, phone, rec);
        window.confirmationResult = res;
        setConfirmRes(res);
        setStep(2);
        document.getElementById('recaptcha-container')!.style.display = 'none';
      } catch (e) {
        console.log('signInWithPhoneNumber', e);
      }
    }
  };

  return (
    <>
      <div id="recaptcha-container"></div>
      {step === 1 && (
        <FormLayout
          title="What’s your phone?"
          text="We’ll send you a sign-in code"
          onSubmit={onSignInSubmit}
          id={'sign-in-button'}
        >
          <input
            type="text"
            placeholder="Insert mobile phone"
            required
            pattern="^([+]{1}[0-9]{11,20})?$"
            className="input on-boarding__email"
            onInput={changePhone}
          />
        </FormLayout>
      )}
      {step === 2 && (
        <FormLayout
          title="Enter sign-in code"
          text={`We just sent it to  ${phone}.`}
          onSubmit={onCodeSubmitHandler}
        >
          <OtpInput value={otp} valueLength={6} onChange={setOtp}></OtpInput>
        </FormLayout>
      )}
    </>
  );
};

export default AuthPhone;
