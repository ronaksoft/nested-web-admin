import Api from './../index';
import _ from 'lodash';
import IReportRequest from './interfaces/IReportRequest';
export default class PlaceApi {
  private api;

  constructor() {
    this.api = Api.getInstance();
  }


  getRequests(params: IReportRequest): Promise<any> {
    return this.api.server.request({
      cmd: 'report/get_ts_single_val',
      data: _.merge(params, { key: 'requests'}),
    });
  }
};
