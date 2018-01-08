import Api from './../index';
import ISetMessageTemplateRequest from './ISetMessageTemplateRequest';
import ISetMessageTemplateResponse from './ISetMessageTemplateResponse';
import IGetMessageTemplateRequest from './IGetMessageTemplateRequest';
import IGetMessageTemplateResponse from './IGetMessageTemplateResponse';
import ICreatePostRequest from './ICreatePostRequest';
import ICreatePostResponse from './ICreatePostResponse';

export default class FileApi {
  private api;

  constructor() {
    this.api = Api.getInstance();
  }


  setMessageTemplate(setMessageTemplateRequest: ISetMessageTemplateRequest): Promise<any> {
    return this.api.server.request({
        cmd: 'admin/set_message_template',
        data: setMessageTemplateRequest,
    });
  }

  getMessageTemplate(setMessageTemplateRequest: IGetMessageTemplateRequest): Promise<any> {
    return this.api.server.request({
        cmd: 'admin/get_message_templates',
        data: setMessageTemplateRequest,
    });
  }

  createPost(createPostRequest: ICreatePostRequest): Promise<any> {
    return this.api.server.request({
        cmd: 'admin/create_post',
        data: createPostRequest,
    });
  }

}
