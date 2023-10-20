'use client';

import FormLayout from '../../components/FormLayout';
import { useState } from 'react';
import OtpInput from '../../components/OtpInput';
import { useRouter } from 'next/navigation';

const page = () => {
  const [otp, setOtp] = useState<string>('');
  const { push } = useRouter();

  const onCodeSubmitHandler = async () => {
    push('/dashboard/main');
  };
  return (
    <FormLayout
      title="Enter sign-in code"
      text={`We just sent it to  phone.`}
      onSubmit={onCodeSubmitHandler}
    >
      <OtpInput value={otp} valueLength={6} onChange={setOtp}></OtpInput>
    </FormLayout>
  );
};

export default page;
