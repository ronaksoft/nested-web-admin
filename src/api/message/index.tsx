import Api from './../index';
import ISetMessageTemplateRequest from '../../interfaces/ISetMessageTemplateRequest';
import ISetMessageTemplateResponse from '../../interfaces/ISetMessageTemplateResponse';
import IGetMessageTemplateRequest from '../../interfaces/IGetMessageTemplateRequest';
import IGetMessageTemplateResponse from '../../interfaces/IGetMessageTemplateResponse';
import ICreatePostRequest from '../../interfaces/ICreatePostRequest';
import ICreatePostResponse from '../../interfaces/ICreatePostResponse';

export default class FileApi {
  private api: Api;

  constructor() {
    this.api = Api.getInstance();
  }

  setMessageTemplate(setMessageTemplateRequest: ISetMessageTemplateRequest): Promise<ISetMessageTemplateResponse> {
    return this.api.server.request({
      cmd: 'admin/set_message_template',
      data: setMessageTemplateRequest,
    });
  }

  getMessageTemplate(setMessageTemplateRequest: IGetMessageTemplateRequest | {}): Promise<IGetMessageTemplateResponse> {
    return this.api.server.request({
      cmd: 'admin/get_message_templates',
      data: setMessageTemplateRequest,
    });
  }

  createPost(createPostRequest: ICreatePostRequest): Promise<ICreatePostResponse> {
    return this.api.server.request({
      cmd: 'admin/create_post',
      data: createPostRequest,
    });
  }
}
