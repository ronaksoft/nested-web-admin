import IPerson from './IPerson';
import Account from '/src/app/common/account/Account';

export default class Person extends Account implements IPerson {
  place_count: number;
  join_date: number;
  last_activity: number;
  gender: string;
  dob: string;
  searchable: boolean;
  status: string;

  constructor() {
    super();

    this.place_count = undefined;
    this.join_date = undefined;
    this.last_activity = undefined;
    this.gender = undefined;
    this.dob = undefined;
    this.searchable = undefined;
    this.status = undefined;
  }
}
