import FilterGroup from '../consts/FilterGroup';
import AccountListSort from '../consts/AccountListSort';

interface IGetListRequest {
  keyword?: string;
  skip?: number;
  limit?: number;
  filter?: FilterGroup;
  sort?: AccountListSort;
}

export default IGetListRequest;
