import IPlaceCounter from './IPlaceCounter';
import IPlaceLimits from './IPlaceLimits';
import IPicture from '../../interfaces/IPicture';
import IPlacePolicy from './IPlacePolicy';
import IPlacePrivacy from './IPlacePrivacy';
import C_PLACE_TYPE from '../../consts/CPlaceType';

interface IPlace {
    _id: string;
    created_on: number;
    creators: Array<string>;
    description: string;
    grand_parent_id: string;
    groups: any;
    counters?: any;
    limits: IPlaceLimits;
    name: string;
    picture: IPicture;
    policy: IPlacePolicy;
    privacy: IPlacePrivacy;
    type: any;
    unlocked_childs: Array<any>;
    isChecked?: boolean;
}

export default IPlace;
