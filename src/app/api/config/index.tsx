import Api from './../index';
import IGetConstantsResponse from './interfaces/IGetConstantsResponse';

export default class ConfigApi {
  private api;

  constructor() {
    this.api = Api.getInstance();
  }


  getConstants(): Promise<any> {
    return this.api.server.request({
      cmd: 'admin/get_int_constants',
      data: {},
    }).then((res: IGetConstantsResponse) => {
      return res;
    }).catch((err) => {
      console.log(err);
    });
  }

  setConstants(req: IGetConstantsResponse): Promise<any> {
    let requestDate = {};

    Object.keys(req).forEach((key: string) => {
      requestDate[key] = parseInt(req[key], 10);
    });

    return this.api.server.request({
      cmd: 'admin/set_int_constants',
      data: requestDate,
    }).then((res) => {
      console.log(res);
      return res;
    }).catch((err) => {
      console.log(err);
    });
  }

};
