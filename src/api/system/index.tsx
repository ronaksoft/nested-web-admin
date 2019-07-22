import Api from './../index';
import IGetStringConstantsResponse from '../../interfaces/IGetStringConstantsResponse';
import IGetSystemCountersResponse from '../../interfaces/IGetSystemCountersResponse';
import IGetConstantsResponse from '../../interfaces/IGetConstantsResponse';
import IGetStatsResponse from '../../interfaces/IGetStatsResponse';
import IGetOnlineUsers from '../../interfaces/IGetOnlineUsers';

export default class SystemApi {
  private api: Api;

  constructor() {
    this.api = Api.getInstance();
  }

  getSystemCounters(): Promise<any> {
    return this.api.server
      .request({ cmd: 'system/get_counters', data: {} })
      .then((res: IGetSystemCountersResponse) => {
        return res;
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  getConstants(): Promise<any> {
    return this.api.server
      .request({ cmd: 'system/get_int_constants', data: {} })
      .then((res: IGetConstantsResponse) => {
        return res;
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  getStringConstants(): Promise<any> {
    return this.api.server
      .request({ cmd: 'system/get_string_constants', data: {} })
      .then((res: IGetStringConstantsResponse) => {
        return res;
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  getStats(): Promise<any> {
    return this.api.server
      .request({ cmd: 'system/stats', data: {} })
      .then((res: IGetStatsResponse) => {
        return res;
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  getOnlineUsers(): Promise<any> {
    return this.api.server
      .request({ cmd: 'system/online_users', data: {} })
      .then((res: IGetOnlineUsers) => {
        return res.online_users;
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  setConstants(req: IGetConstantsResponse): Promise<any> {
    let requestDate: any = {};

    Object.keys(req).forEach((key: string) => {
      requestDate[key] = parseInt(req[key], 10);
    });

    return this.api.server
      .request({ cmd: 'system/set_int_constants', data: requestDate })
      .then((res: any) => {
        return res;
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  setStringConstants(req: IGetStringConstantsResponse): Promise<any> {
    return this.api.server
      .request({ cmd: 'system/set_string_constants', data: req })
      .then((res: any) => {
        return res;
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  runHealthCheck() {
    return this.api.server
      .request({ cmd: 'admin/health_check', data: {} })
      .then((res: any) => {
        return res;
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  getHealthCheckState() {
    return this.api.server
      .request({
        cmd: 'admin/health_check',
        data: {
          check_state: true,
        },
      })
      .then((res: any) => {
        return res;
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  getCompanyInfo() {
    return this.api.server.request({
      cmd: 'system/get_string_constants',
      data: {},
      withoutQueue: true,
    });
  }

  getLicense() {
    return this.api.server.request({
      cmd: 'system/get_license',
      data: {},
    });
  }

  setLicense(license_key: string) {
    return this.api.server.request({
      cmd: 'system/set_license',
      data: { license_key },
    });
  }
}
