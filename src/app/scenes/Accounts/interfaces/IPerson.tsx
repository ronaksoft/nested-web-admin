import IAccount from './IAccount';

interface IPerson extends IAccount {
    place_count: number;
    joined_on: number;
    last_activity: number;
    gender: string;
    dob: string;
    disabled: boolean;
    searchable: boolean;
    status: string;
    limits: any;
    email: string;
    isChecked?: boolean;
}

export default IPerson;
