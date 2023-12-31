import { User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
export interface IMessage {
  author: string;
}

export enum AuthType {
  EMAIL,
  PHONE,
}

export type ContextUser = {
  currentUser: User | null | undefined;
};

export type UserBD = {
  photoURL: string;
  uid: string;
  online: boolean;
  email: string;
  phone: string;
  displayName: string;
  lastSeen: Timestamp;
  about: string;
  createdAt: Timestamp;
};

export type authUser = {
  displayName: string;
  photoURL: string;
  uid: string;
  user: string;
  email: string;
};

export interface IChatContext {
  data: IChatState;
  dispatch: React.Dispatch<IChangeUserAction>;
}

export enum ActionType {
  ChangeUser = 'CHANGE_USER',
}

export const initialState: IChatState = {
  chatId: null,
  user: null,
};

export interface IChangeUserAction {
  type: ActionType;
  payload: {
    user: string;
    uid: string;
  };
}
export interface IChatState {
  chatId: string | null;
  user: string | null;
}
export interface IMessageFirebase {
  date: any;
  id: string;
  senderId: string;
  img: string;
  text: string;
  // date: Timestamp;
  like?: boolean;
  dislike?: boolean;
}
export interface IMessageProp {
  message: IMessageFirebase;
}

// export interface IFile {
//   lastModified: number;
//   lastModifiedDate: Timestamp;
//   name: string;
//   size: number;
//   type: string;
//   webkitRelativePath: string;
// }

export type MessageType = 'text' | 'img' | 'audio' | 'video' | 'url';
