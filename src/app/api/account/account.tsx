import Api from './../index';
import Server from './../../services/classes/server/index';
import RequestBundle from './../requestBundle/index';
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
import IGetListRequest from './interfaces/IGetListRequest';
import ISessionRegisterRequest from './interfaces/ISessionRegisterRequest';
import C_USER_SEARCH_AREA from '../consts/CUserSearchArea';

export default class AccountApi {
    private api;
    private requestBundle: RequestBundle;

    constructor() {
        this.requestBundle = RequestBundle.getInstance();
        this.api = Api.getInstance();
    }

    sessionRecall(sessionRecallParams: ISessionRecallRequest): Promise<any> {
        if (localStorage.getItem('nested.server.domain')) {
            return this.api.reconfigEndPoints(localStorage.getItem('nested.server.domain'))
                .then(() => {
                    return this.api.server.request({
                        cmd: 'session/recall',
                        data: sessionRecallParams,
                        withoutQueue: true,
                    }).then((res: ISessionRecallResponse) => {
                        return res.account;
                    });
                });
        } else {
            return this.api.server.request({
                cmd: 'session/recall',
                data: sessionRecallParams,
                withoutQueue: true,
            }).then((res: ISessionRecallResponse) => {
                return res.account;
            });
        }
    }

    /**
     * @func get
     * @desc Retrieves the current user account data
     * @param {IAccountGetRequest} data
     * @returns {Promise<any>}
     * @memberof AccountApi
     */
    accountGet(data: IAccountGetRequest): Promise<any> {
        // return this.api.request({
        //   cmd: 'account/get',
        //   data,
        // });
        // console.log(this.requestBundle);
        return this.requestBundle.observeRequest('account', data.account_id, false, '_id', 'accounts', this.getManyPrivate);
    }

    /**
     * @func get
     * @desc Retrieves the current user account data
     * @param {string} ids
     * @memberof AccountApi
     */
    getManyPrivate(ids: string) {
        const data: IAccountGetRequest = {
            account_id: ids,
        };
        return {
            cmd: 'account/get_many',
            data: data,
        };
    }


    getAll(params: IGetListRequest): Promise<any> {
        return this.api.server.request({
            cmd: 'admin/account_list',
            data: params,
        }).then((res: any) => {
            return res;
        }).catch((err) => {
            console.log(err);
        });
    }


    login(data: ISessionRegisterRequest): Promise<any> {
        if (this.api.server === null) {
            this.api.server = new Server();
        }
        return this.api.server.request({
            cmd: 'session/register',
            data: data,
        }).then((res: any) => {
            return res;
        }).catch((err) => {
            console.log(err);
        });
    }


    signout(): Promise<any> {
        return this.api.server.request({
            cmd: 'session/close'
        }).then((res: any) => {
            return res;
        }).catch((err) => {
            console.log(err);
        });
    }

    getMembers(params: IGetMembersRequest): Promise<any> {
        return this.api.server.request({
            cmd: 'admin/place_list_members',
            data: params,
        }).then((res: any) => {
            return res;
        }).catch((err) => {
            console.log(err);
        });
    }

    register(req: IRegisterRequest): Promise<any> {
        return this.api.server.request({
            cmd: 'admin/account_register',
            data: req,
        });
    }

    promote(req: IPromoteRequest): Promise<any> {
        return this.api.server.request({
            cmd: 'admin/promote',
            data: req,
        }).then((res: IUser) => {
            return res;
        });
    }

    demote(req: IDemoteRequest): Promise<any> {
        return this.api.server.request({
            cmd: 'admin/demote',
            data: req,
        }).then((res: IUser) => {
            return res;
        });
    }

    disable(req: IDisableRequest): Promise<any> {
        return this.api.server.request({
            cmd: 'admin/account_disable',
            data: req,
        }).then((res: IUser) => {
            return res;
        });
    }

    enable(req: IEnableRequest): Promise<any> {
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

    phoneAvailable(params: { phone: string }): Promise<any> {
        return this.api.server.request({
            cmd: 'auth/phone_available',
            data: params
        }).then((res) => {
            if (res.err_code) {
                return false;
            } else {
                return true;
            }
        });
    }

    usernameAvailable(params: { account_id: string }): Promise<any> {
        return this.api.server.request({
            cmd: 'account/available',
            data: params
        }).then((res) => {
            if (res.err_code) {
                return false;
            } else {
                return true;
            }
        });
    }

    search(keyword: string, limit: number, area: string): Promise<any> {
        if (area === undefined) {
            area = C_USER_SEARCH_AREA.ACCOUNTS;
        }
        return this.api.server.request({
            cmd: 'search/accounts' + area,
            data: {
                keyword: keyword,
                limit: limit,
            }
        });
    }
}
