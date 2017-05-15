import FilterGroup from '../../../scenes/Accounts/FilterGroup';
interface IGetListRequest {
    skip: Number;
    limit: Number;
    filter: FilterGroup;
}

export default IGetListRequest;
