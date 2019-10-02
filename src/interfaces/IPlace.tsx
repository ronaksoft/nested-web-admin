import IPlaceCounter from './IPlaceCounter';
import IPlaceLimits from './IPlaceLimits';
import IPicture from './IPicture';
import IPlacePolicy from './IPlacePolicy';
import IPlacePrivacy from './IPlacePrivacy';
import C_PLACE_TYPE from '../consts/CPlaceType';

interface IPlace {
  _id: string;
  created_on: number;
  creators: string[];
  key_holders: string[];
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
  place_type: string;
  unlocked_childs: any[];
  access: any[];
  children?: IPlace[];
  isChecked?: boolean;
  expanded?: boolean;
  child?: boolean;
  level?: number;
}

export default IPlace;
