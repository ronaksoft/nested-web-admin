import IAccount from './IAccount';

interface IPerson extends IAccount {
  place_count: number;
  join_date: number;
  last_activity: number;
  gender: string;
  dob: string;
  searchable: boolean;
  status: string;
}

export default IPerson;
