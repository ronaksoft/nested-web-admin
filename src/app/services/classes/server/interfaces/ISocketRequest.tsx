import IRequest from './IRequest';

interface ISocketRequest extends IRequest {
    _sk: string | null;
    _ss: string | null;
    _cver: number;
    _cid: string;
}

export default ISocketRequest;

