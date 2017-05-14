import Api from './../index';
import IPlaceListResponse from './interfaces/IPlaceListResponse';
import IPlaceListRequest from './interfaces/IPlaceListRequest';

export default class AccountApi {
  private api;

  constructor() {
    this.api = Api.getInstance();
  }


  placeList(placeListRequest: IPlaceListRequest): Promise<any> {
    return this.api.server.request({
      cmd: 'admin/place_list',
      data: placeListRequest,
    }).then((res: IPlaceListResponse) => {
      return res.places;
    }).catch((err) => {
      console.log(err);
    });
  }

};
