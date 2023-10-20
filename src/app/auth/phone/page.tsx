'use client';

import { useState } from 'react';
import FormLayout from '../components/FormLayout';
import { useRouter } from 'next/navigation';
import '../../../../public/assets/styles/style.scss';

const AuthPhone = () => {
  const [step, setStep] = useState<number>(1);
  const [phone, setPhone] = useState<string>('');

  const router = useRouter();

  const changePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const onSignInSubmit = async () => {
    if (phone) {
      try {
        router.push('/auth/phone/code');
        document.getElementById('recaptcha-container')!.style.display = 'none';
      } catch (e) {
        console.log('signInWithPhoneNumber', e);
      }
    }
  };

  return (
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
  );
};

export default AuthPhone;
