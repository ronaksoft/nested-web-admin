import PacketState from './PacketState';
// import IUnique from './interfaces/IUnique';
// import _ from 'lodash';
import IAccount from './interfaces/IAccount';

interface IPocket {
    key: string;
    model: IAccount;
    status: PacketState;
    password: boolean;
    messages: string[];
}

export default IPocket;
