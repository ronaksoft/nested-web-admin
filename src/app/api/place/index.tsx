import Api from './../index';
import IPlaceListResponse from './interfaces/IPlaceListResponse';
import IPlaceListRequest from './interfaces/IPlaceListRequest';
import IPlaceListMembersRequest from './interfaces/IPlaceListMembersRequest';
import IPlaceListMembersResponse from './interfaces/IPlaceListMembersResponse';
import IAccountPlacesRequest from './interfaces/IAccountPlacesRequest';
import IPlaceAddMembersRequest from './interfaces/IPlaceAddMembersRequest';
import IPlaceSetPictureRequest from './interfaces/IPlaceSetPictureRequest';
import IPlaceUpdate from './interfaces/IPlaceUpdate';
import IPlaceCreateRequest from './interfaces/IPlaceCreateRequest';
import IPlaceDeleteRequest from './interfaces/IPlaceDeleteRequest';

export default class PlaceApi {
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

    getAccountPlaces(params: IAccountPlacesRequest): Promise<any> {
        return this.api.server.request({
            cmd: 'admin/account_list_places',
            data: params,
        });
    }

    getPlaceListMemebers(params: IPlaceListMembersRequest): Promise<any> {
        return this.api.server.request({
            cmd: 'admin/place_list_members',
            data: params,
        }).then((res: IPlaceListMembersResponse) => {
            return res.accounts;
        });
    }

    placeAddMember(params: IPlaceAddMembersRequest): Promise<any> {
        return this.api.server.request({
            cmd: 'admin/place_add_member',
            data: params,
        });
    }

    placeLimitEdit(params: any): Promise<any> {
        return this.api.server.request({
            cmd: 'admin/place_update',
            data: params,
        });
    }

    isIdAvailable(id: string): Promise<any> {
        return this.api.server.request({
            cmd: 'place/available',
            data: {
                place_id: id,
            },
        });
    }

    placeCreate(params: any): Promise<any> {
        return this.api.server.request({
            cmd: 'admin/create_grand_place',
            data: params,
        });
    }

    placeSubCreate(params: any): Promise<any> {
        return this.api.server.request({
            cmd: 'admin/create_place',
            data: params,
        });
    }

    placeَUpdate(params: any): Promise<any> {
        return this.api.server.request({
            cmd: 'admin/place_update',
            data: params,
        });
    }

    placeDelete(params: IPlaceDeleteRequest): Promise<any> {
        return this.api.server.request({
            cmd: 'admin/place_remove',
            data: params,
        });
    }

    promoteMember(params: IPlaceAddMembersRequest): Promise<any> {
        return this.api.server.request({
            cmd: 'admin/place_promote_member',
            data: params,
        });
    }

    demoteMember(params: IPlaceAddMembersRequest): Promise<any> {
        return this.api.server.request({
            cmd: 'admin/place_demote_member',
            data: params,
        });
    }

    removeMember(params: IPlaceAddMembersRequest): Promise<any> {
        return this.api.server.request({
            cmd: 'admin/place_remove_member',
            data: params,
        });
    }

    setPicture(params: IPlaceSetPictureRequest): Promise<any> {
        return this.api.server.request({
            cmd: 'admin/place_set_picture',
            data: params,
        });
    }

}
