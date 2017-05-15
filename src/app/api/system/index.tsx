import Api from './../index';
import IGetSystemCountersResponse from './interfaces/IGetSystemCountersResponse';

export default class SystemApi {
  private api;

  constructor() {
    this.api = Api.getInstance();
  }


  getSystemCounters(): Promise<any> {
    return this.api.server.request({
      cmd: 'admin/get_system_counters',
      data: {},
    }).then((res: IGetSystemCountersResponse) => {
      return res;
    }).catch((err) => {
      console.log(err);
    });
  }

};
