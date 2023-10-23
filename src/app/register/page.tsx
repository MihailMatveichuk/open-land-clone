'use client';

import InputFile from './components/InputFile';
import { useState } from 'react';
import logoSrc from '../../../public/assets/images/Avatar.png';
import { useRouter } from 'next/navigation';

const Register = () => {
  const [image, setImage] = useState<string | ArrayBuffer>(logoSrc);
  const { push } = useRouter();
  const handleSubmit = async (e: {
    target: any;
    preventDefault: () => void;
  }) => {
    e.preventDefault();
    try {
      push('/main');
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
