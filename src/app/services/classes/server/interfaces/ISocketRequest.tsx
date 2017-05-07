import IRequest from './IRequest';

interface ISocketRequest extends IRequest {
    _sk: string | null;
    _ss: string | null;
}

export default ISocketRequest;

