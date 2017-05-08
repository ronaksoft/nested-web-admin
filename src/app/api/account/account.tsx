import Api from './../index';
import ISessionRecallRequest from './interfaces/ISessionRecallRequest';
import ISessionRecallResponse from './interfaces/ISessionRecallResponse';

export default class AccountApi {
    private api;

    constructor() {
        console.log(Api);
        this.api = Api.getInstance();
    }

    sessionRecall(sessionRecallParams: ISessionRecallRequest) : Promise<any> {
        return this.api.server.request({
            cmd: 'session/recall',
            data: sessionRecallParams,
        }).then((res: ISessionRecallResponse) => {
            console.log(res);
        });
    }
}
