import Api from './../index';
import IGetSystemCountersResponse from './interfaces/IGetSystemCountersResponse';
import IGetConstantsResponse from './interfaces/IGetConstantsResponse';
import IGetStatsResponse from './interfaces/IGetStatsResponse';
import IGetOnlineUsers from './interfaces/IGetOnlineUsers';

export default class SystemApi {
    private api;

    constructor() {
        this.api = Api.getInstance();
    }

    getSystemCounters() : Promise < any > {
        return this.api.server.request({cmd: 'system/get_counters', data: {}}).then((res : IGetSystemCountersResponse) => {
            return res;
        }).catch((err) => {
            console.log(err);
        });
    }

    getConstants() : Promise < any > {
        return this.api.server.request({cmd: 'system/get_int_constants', data: {}}).then((res : IGetConstantsResponse) => {
            return res;
        }).catch((err) => {
            console.log(err);
        });
    }

    getStats() : Promise < any > {
        return this.api.server.request({cmd: 'system/stats', data: {}}).then((res : IGetStatsResponse) => {
            return res;
        }).catch((err) => {
            console.log(err);
        });
    }

    getOnlineUsers() : Promise < any > {
        return this.api.server.request({cmd: 'system/online_users', data: {}}).then((res : IGetOnlineUsers) => {
            return res.online_users;
        }).catch((err) => {
            console.log(err);
        });
    }

    setConstants(req : IGetConstantsResponse) : Promise < any > {
        let requestDate = {};

        Object.keys(req).forEach((key : string) => {
            requestDate[key] = parseInt(req[key], 10);
        });

        return this.api.server.request({cmd: 'system/set_int_constants', data: requestDate}).then((res) => {
            console.log(res);
            return res;
        }).catch((err) => {
            console.log(err);
        });
    }

    runHealthCheck() {
        return this.api.server.request({cmd: 'admin/health_check', data: {}}).then((res : any) => {
            return res;
        }).catch((err) => {
            console.log(err);
        });
    }

    getHealthCheckState() {
        return this.api.server.request({
            cmd: 'admin/health_check',
            data: {
                'check_state': true
            }
        }).then((res : any) => {
            return res;
        }).catch((err) => {
            console.log(err);
        });
    }

}
