import FilterGroup from '../../../scenes/Accounts/FilterGroup';
interface IGetListRequest {
    keyword?: string;
    skip?: Number;
    limit?: Number;
    filter?: FilterGroup;
    sort?: string;
}

export default IGetListRequest;
