'use client';

import {
  useState,
  createContext,
  SetStateAction,
  PropsWithChildren,
} from 'react';

interface IEmail {
  newEmail?: string;
  newUid?: string;
}

interface IRegister extends IEmail {
  setNewEmail: React.Dispatch<SetStateAction<IEmail | undefined>>;
}

export const RegisterContex = createContext<IRegister>({
  newEmail: '',
  newUid: '',
  setNewEmail: () => {},
});

export const RegisterContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [newEmail, setNewEmail] = useState<IEmail>();

  return (
    <RegisterContex.Provider value={{ ...newEmail, setNewEmail }}>
      {children}
    </RegisterContex.Provider>
  );
};
