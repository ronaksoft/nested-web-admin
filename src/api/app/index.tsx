import Api from './../index';
import IListRequest from '../../interfaces/IListRequest';
import IRegisterAppRequest from '../../interfaces/IRegisterAppRequest';
import IRemoveRequest from '../../interfaces/IRemoveRequest';

export default class AppApi {
  private api: Api;

  constructor() {
    this.api = Api.getInstance();
  }

  exists(app_id: string): Promise<any> {
    return this.api.server.request({
      cmd: 'app/exists',
      data: {
        app_id,
      },
    });
  }

  register(params: IRegisterAppRequest): Promise<any> {
    return this.api.server.request({
      cmd: 'app/register',
      data: {
        app_id: params.app_id,
        app_name: params.app_name,
        homepage: params.homepage,
        developer: params.developer,
        icon_large_url: params.icon_large_url,
        icon_small_url: params.icon_small_url,
      },
    });
  }

  remove(params: IRemoveRequest): Promise<any> {
    return this.api.server.request({
      cmd: 'app/remove',
      data: {
        app_id: params.app_id,
      },
    });
  }

  list(params: IListRequest): Promise<any> {
    return this.api.server.request({
      cmd: 'app/list',
      data: {
        keyword: params.keyword,
      },
    });
  }

  search(params: IListRequest): Promise<any> {
    return this.api.server.request({
      cmd: 'search/apps',
      data: {
        keyword: params.keyword,
      },
    });
  }
}
