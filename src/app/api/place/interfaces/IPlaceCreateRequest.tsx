import IPlacePolicy from './IPlacePolicy';
import IPlacePrivacy from './IPlacePrivacy';
import IPlaceLimits from './IPlaceLimits';

interface IPlaceCreateRequest {
    place_id: string;
    place_name: string;
    place_description: string;
    picture: string;
    policy: IPlacePolicy;
    privacy: IPlacePrivacy;
    limits?: IPlaceLimits;
}

export default IPlaceCreateRequest;
