import Api from './../index';
import IPlaceListResponse from './interfaces/IPlaceListResponse';

export default class AccountApi {
    private api;

    constructor() {
        this.api = Api.getInstance();
    }


    placeList(): Promise<any> {
        return this.api.server.request({
            cmd: 'admin/place_list',
            data: {},
        }).then((res: IPlaceListResponse) => {
            return res.places;
        }).catch((err) => {
            console.log(err);
        });
    }

};
