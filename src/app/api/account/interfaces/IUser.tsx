import IPicture from 'IPicture.ts';
import IGender from 'IGender.ts';
import IAccountCounters from './IAccountCounters';

interface IUser {
    _id : string;
    name: string;
    family : string;
    picture : IPicture;
    disabled: boolean;
    dob: string;
    email: string;
    fname: string;
    gender: IGender;
    phone: string;
    registered: string;
    isAdmin : boolean;
    counters : IAccountCounters;
};

export default IUser;
