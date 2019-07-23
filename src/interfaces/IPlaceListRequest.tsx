interface IPlaceListRequest {
  keyword?: string;
  skip?: number;
  limit?: number;
  filter?: string;
  grand_parent_id?: string;
  sort?: string;
  only_grand: boolean;
}

export default IPlaceListRequest;
