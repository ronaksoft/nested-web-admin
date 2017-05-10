import Api from './../index';
import ISessionRecallRequest from './interfaces/ISessionRecallRequest';
import ISessionRecallResponse from './interfaces/ISessionRecallResponse';
import IAccountGetRequest from './interfaces/IAccountGetRequest';
import IRegisterRequest from './interfaces/IRegisterRequest';
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
            withoutQueue : true,
        }).then((res: ISessionRecallResponse) => {
            return res;
        });
    }


    accountGet(accountGetRequest: IAccountGetRequest) : Promise<any> {
        return this.api.server.request({
          cmd: 'account/get',
          data: accountGetRequest,
        }).then((res: IUser) => {
          return res;
        }).catch((err) => {
          console.log(err);
        });
    }


    accountList() : Promise {
      return new Promise((resolve: Handler, reject: Handler) => {
        this.api.server.request({
          cmd: 'admin/account_list',
          data: {},
        })
        .then((response: any) => resolve(response.accounts))
        .catch((error: any) => reject(error));
      });
    }

    register(req: IRegisterRequest) : Promise<any> {
        return this.api.server.request({
          cmd: 'admin/account_register',
          data: req,
        }).then((res: IUser) => {
          return res;
        });
    }
}
