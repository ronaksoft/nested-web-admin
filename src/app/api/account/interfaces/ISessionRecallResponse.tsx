import IUser from './IUser';

interface ISessionRecallRequest {
    _sk: string;
    _ss: string;
    _did ?: string;
    _dt ?: string;
    _do ?: string;
    account ?: IUser;
}

export default ISessionRecallRequest ;
