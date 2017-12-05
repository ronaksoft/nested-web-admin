import Api from './../index';
import ISetMessageTemplateRequest from './ISetMessageTemplateRequest';
import ISetMessageTemplateResponse from './ISetMessageTemplateResponse';
import IGetMessageTemplateRequest from './IGetMessageTemplateRequest';
import IGetMessageTemplateResponse from './IGetMessageTemplateResponse';

export default class FileApi {
  private api;

  constructor() {
    this.api = Api.getInstance();
  }


  setMessageTemplate(setMessageTemplateRequest: ISetMessageTemplateRequest): Promise<any> {
    return this.api.server.request({
        cmd: 'admin/set_message_template',
        data: setMessageTemplateRequest,
    }).then((res: ISetMessageTemplateResponse) => {
      console.log(res);
        return res;
    }).catch((err) => {
        console.log(err);
    });
  }

  getMessageTemplate(setMessageTemplateRequest: IGetMessageTemplateRequest): Promise<any> {
    return this.api.server.request({
        cmd: 'admin/get_message_templates',
        data: setMessageTemplateRequest,
    }).then((res: IGetMessageTemplateResponse) => {
        return res.message_templates;
    }).catch((err) => {
        console.log(err);
    });
  }

}
