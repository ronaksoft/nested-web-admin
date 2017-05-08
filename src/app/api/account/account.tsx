import Api from './../index';
import ISessionRecallRequest from './interfaces/ISessionRecallRequest';
import ISessionRecallResponse from './interfaces/ISessionRecallResponse';
import IAccountGetRequest from './interfaces/IAccountGetRequest';
import IUser from './interfaces/IUser';

export default class AccountApi {
    private api;

    constructor() {
        this.api = Api.getInstance();
    }

    sessionRecall(sessionRecallParams: ISessionRecallRequest) : Promise<any> {
        return this.api.server.request({
            cmd: 'session/recall',
            data: sessionRecallParams,
        }).then((res: ISessionRecallResponse) => {
            this.api.server.setSessionKey(res._sk);
            this.api.server.setSessionSecret(res._ss);
            return res;
        });
    }


    accountGet(accountGetRequest: IAccountGetRequest) : Promise<any> {
        return this.api.server.request({
          cmd: 'account/get',
          data: accountGetRequest,
        }).then((res: IUser) => {
          return res;
        });
    }
}
