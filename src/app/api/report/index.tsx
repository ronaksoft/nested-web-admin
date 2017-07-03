import Api from './../index';
import _ from 'lodash';
import IReportRequest from './interfaces/IReportRequest';
import ReportType from './ReportType';

export default class PlaceApi {
  private api;

  constructor() {
    this.api = Api.getInstance();

    this.reportTypeMap = {};
    this.reportTypeMap[ReportType.AddPost] = 'post_add';
    this.reportTypeMap[ReportType.AddEmail] = 'post_ext_add';
    this.reportTypeMap[ReportType.AttachmentSize] = 'post_attach_size';
    this.reportTypeMap[ReportType.AttachmentCount] = 'post_attach_count';
    this.reportTypeMap[ReportType.AddComment] = 'comment_add';
    this.reportTypeMap[ReportType.Login] = 'session_login';
    this.reportTypeMap[ReportType.SessionRecall] = 'session_recall';
    this.reportTypeMap[ReportType.AllRequests] = 'requests';
    this.reportTypeMap[ReportType.dataIn] = 'data_in';
    this.reportTypeMap[ReportType.dataOut] = 'data_out';
    this.reportTypeMap[ReportType.processTime] = 'process_time';
  }


  get(params: IReportRequest): Promise<any> {
    return this.api.server.request({
      cmd: 'report/get_ts_single_val',
      data: {
        from: params.from,
        to: params.to,
        key: this.reportTypeMap[params.type],
        res: params.res || 'd'
      }
    });
  }

};
