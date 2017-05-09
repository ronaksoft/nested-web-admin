import {IAccount} from '/src/app/common/account/IAccount';
import Account from '/src/app/common/account/Account';
console.log(IAccount);
console.log(Account);
export default class Person extends Account implements IAccount {
  place_count: number;
  join_date: number;
  last_activity: number;
  gender: string;
  dob: string;
  searchable: boolean;
  status: string;

  constructor() {
    super();
  }
}
