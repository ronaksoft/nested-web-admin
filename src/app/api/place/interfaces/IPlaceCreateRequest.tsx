import IPlacePolicy from './IPlacePolicy';
import IPlacePrivacy from './IPlacePrivacy';

interface IPlaceCreateRequest {
    place_id: string;
    place_name: string;
    place_description: string;
    picture: string;
    policy: IPlacePolicy;
    privacy: IPlacePrivacy;
}

export default IPlaceCreateRequest;
