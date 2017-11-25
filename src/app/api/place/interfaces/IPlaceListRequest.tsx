interface IPlaceListRequest {
    keyword?: string;
    skip?: number;
    limit?: number;
    filter?: string;
    grand_parent_id?: string;
}

export default IPlaceListRequest;
