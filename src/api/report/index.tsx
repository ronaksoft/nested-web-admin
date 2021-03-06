import ReportType from '../../consts/ReportType';
import IReportRequest from '../../interfaces/IReportRequest';
import Api from './../index';

export default class PlaceApi {
  private api: Api;

  constructor() {
    this.api = Api.getInstance();
  }

  getKey(type: ReportType, id?: string) {
    let key: string;
    switch (type) {
      case ReportType.AddPost:
        key = 'post_add';
        break;
      case ReportType.AddEmail:
        key = 'post_ext_add';
        break;
      case ReportType.AttachmentSize:
        key = 'post_attach_size';
        break;
      case ReportType.AttachmentCount:
        key = 'post_attach_count';
        break;
      case ReportType.AddComment:
        key = 'comment_add';
        break;
      case ReportType.Login:
        key = 'session_login';
        break;
      case ReportType.SessionRecall:
        key = 'session_recall';
        break;
      case ReportType.AllRequests:
        key = 'requests';
        break;
      case ReportType.dataIn:
        key = 'data_in';
        break;
      case ReportType.dataOut:
        key = 'data_out';
        break;
      case ReportType.processTime:
        key = 'process_time';
        break;
      case ReportType.taskAdd:
        key = 'task_add';
        break;
      case ReportType.taskComment:
        key = 'task_comment';
        break;
      case ReportType.taskCompleted:
        key = 'task_completed';
        break;
      case ReportType.PlaceComment:
        key = `place_${id}_comments`;
        break;
      case ReportType.PlacePost:
        key = `place_${id}_posts`;
        break;
      case ReportType.AccountComment:
        key = `account_${id}_comments`;
        break;
      case ReportType.AccountPost:
        key = `account_${id}_posts`;
        break;
      case ReportType.AccountTaskAdd:
        key = `account_${id}_task_add`;
        break;
      case ReportType.AccountTaskComment:
        key = `account_${id}_task_comment`;
        break;
      case ReportType.AccountTaskCommpleted:
        key = `account_${id}_task_completed`;
        break;
      case ReportType.AccountTaskAssigned:
        key = `account_${id}_task_assigned`;
        break;
      default:
        key = 'data_in';
        break;
    }
    return key;
  }

  get(params: IReportRequest): Promise<any> {
    return this.api.server.request({
      cmd: 'report/get_ts_single_val',
      data: {
        res: params.res || 'd',
        to: params.to,
        from: params.from,
        key: this.getKey(params.type, params.id),
      },
    });
  }
}
