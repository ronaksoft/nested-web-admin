import IUser from './IUser';
interface IPrivacy {
  change_profile: boolean;
  change_picture: boolean;
  searchable: boolean;
}
interface IFlags {
  force_password: boolean;
}
interface ILimits {
  grand_places: number;
}
interface IPerson extends IUser {
  place_count: number;
  joined_on: number;
  last_activity: number;
  searchable: boolean;
  status: string;
  limits: ILimits;
  isChecked?: boolean;
  privacy: IPrivacy;
  flags: IFlags;
  access_place_ids?: any[];
  bookmarked_places?: any[];
}

export default IPerson;
