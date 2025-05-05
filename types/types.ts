import { CardModel } from "@intechnity/react-native-kanban-board";

export type Task = {
  id: string;
  title: string;
  description: string;
};

export type Column = {
  id: string;
  title: string;
  tasks: Task[];
};
export type RootStackParamList = {
  Login: undefined;
  board: undefined;
};
export type User = {
  uid: string;
  email: string;
  name?: string;
  createdAt?: any;
};
export type CustomCardModel = CardModel & {
  assignedTo?: string;
  creatDate?: any;
  priority?: string;
};
export type AuthMode = 'login' | 'register';
export type Props = {
  onChange: (searchText: string, filterType: string, user: string) => void;
};
