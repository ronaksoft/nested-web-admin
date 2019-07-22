import IAccountCounters from './IAccountCounters';
import IGender from './IGender';
import IPicture from './IPicture';

interface IAuthority {
  admin: boolean;
  label_editor: boolean;
}

interface IUser {
  _id: string;
  fname: string;
  lname: string;
  phone: string;
  dob?: string;
  fullName?: string;
  email?: string;
  admin?: boolean;
  gender?: IGender;
  picture?: IPicture;
  disabled?: boolean;
  authority?: IAuthority;
  counters?: IAccountCounters;
  pass?: string;
}

export default IUser;
