import Api from './../index';
import ISessionRecallRequest from './interfaces/ISessionRecallRequest';
import ISessionRecallResponse from './interfaces/ISessionRecallResponse';
import IAccountGetRequest from './interfaces/IAccountGetRequest';
import IRegisterRequest from './interfaces/IRegisterRequest';
import IPromoteRequest from './interfaces/IPromoteRequest';
import IDemoteRequest from './interfaces/IDemoteRequest';
import IEnableRequest from './interfaces/IEnableRequest';
import IDisableRequest from './interfaces/IDisableRequest';
import IGetMembersRequest from './interfaces/IGetMembersRequest';
import IUser from './interfaces/IUser';
import ISetPictureRequest from './interfaces/ISetPictureRequest';
import IRemovePictureRequest from './interfaces/IRemovePictureRequest';
import ISetPasswordRequest from './interfaces/ISetPasswordRequest';

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


    getAll(params: IGetListRequest) : Promise<any> {
      return this.api.server.request({
        cmd: 'admin/account_list',
        data: params,
      }).then((res: any) => {
        return res;
      }).catch((err) => {
        console.log(err);
      });
    }

    getMembers(params: IGetMembersRequest) : Promise<any> {
      return this.api.server.request({
        cmd: 'admin/place_list_members',
        data: params,
      }).then((res: any) => {
        return res;
      }).catch((err) => {
        console.log(err);
      });
    }

    register(req: IRegisterRequest) : Promise<any> {
        return this.api.server.request({
            cmd: 'admin/account_register',
            data: req,
        });
    }

    promote(req: IPromoteRequest) : Promise<any> {
        return this.api.server.request({
          cmd: 'admin/promote',
          data: req,
        }).then((res: IUser) => {
          return res;
        });
    }

    demote(req: IDemoteRequest) : Promise<any> {
        return this.api.server.request({
          cmd: 'admin/demote',
          data: req,
        }).then((res: IUser) => {
          return res;
        });
    }

    disable(req: IDisableRequest) : Promise<any> {
        return this.api.server.request({
          cmd: 'admin/account_disable',
          data: req,
        }).then((res: IUser) => {
          return res;
        });
    }

    enable(req: IEnableRequest) : Promise<any> {
        return this.api.server.request({
          cmd: 'admin/account_enable',
          data: req,
        }).then((res: IUser) => {
          return res;
        });
    }

    getCounters(): Promise<any> {
        return this.api.server.request({
            cmd: 'admin/get_system_counters',
            data: {}
        }).then((response) => {
            return response;
        }).catch((error) => {
            return error;
        });
    }

    edit(params: IEditAccountRequest): Promise<any> {
      return new Promise((resolve, reject) => {
        this.api.server.request({
            cmd: 'admin/account_update',
            data: params
        }).then(resolve, reject);
      });
    }

    getUploadToken(): Promise<any> {
      return this.api.server.request({
        cmd: 'file/get_upload_token',
        data: {}
      });
    }

    setPicture(params: ISetPictureRequest): Promise<any> {
      return this.api.server.request({
        cmd: 'admin/account_set_picture',
        data: params
      });
    }

    removePicture(params: IRemovePictureRequest): Promise<any> {
      return this.api.server.request({
        cmd: 'admin/account_remove_picture',
        data: params
      });
    }

    setPassword(params: ISetPasswordRequest): Promise<any> {
      return this.api.server.request({
        cmd: 'admin/account_set_pass',
        data: params
      });
    }
}
