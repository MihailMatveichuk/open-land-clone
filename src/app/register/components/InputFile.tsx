'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';

type InputFileProps = {
  src: string | ArrayBuffer;
  onChange: (val: string | ArrayBuffer) => void;
};
const InputFile: React.FC<InputFileProps> = ({ src, onChange }) => {
  const fileReader = new FileReader();

  const changePhoto = () => {
    if (!fileReader.result) return;
    onChange(fileReader.result);
  };
  fileReader.addEventListener('load', changePhoto);
  fileReader.onabort = (e) => console.log(e);
  fileReader.onerror = (e) => console.log(e);

  useEffect(() => {
    fileReader.addEventListener('load', changePhoto);
    return () => {
      fileReader.removeEventListener('load', changePhoto);
    };
  }, []);

  const onFileLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = Array.from(e.target.files as ArrayLike<File>);
    const [file] = fileList;
    if (file && file.type.includes('image')) {
      fileReader.readAsDataURL(file);
    }
  };
  return (
    <div className="logo-choose">
      <input
        style={{ display: 'none' }}
        type="file"
        id="file"
        onChange={onFileLoad}
      />
      <label
        htmlFor="file"
        style={{
          width: '120px',
          height: '120px',
        }}
      >
        <Image
          src={src as string}
          alt="file"
          id="input_img"
          width={96}
          height={96}
        />
      </label>
    </div>
  );
};

export default InputFile;
