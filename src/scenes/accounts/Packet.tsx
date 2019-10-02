import PacketState from './PacketState';
import IUser from '../../interfaces/IUser';

interface IPocket {
  key: string;
  model: IUser;
  status: PacketState;
  password: boolean;
  messages?: string[];
}

export default IPocket;
