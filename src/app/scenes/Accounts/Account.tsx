import _ from 'lodash';
import IAccount from './interfaces/IAccount';

export default class Account implements IAccount {
    _id: string;
    fname: string;
    lname: string;
    name: string;
    phone: string;
    pass: string;

    constructor(_id?: string, fname?: string, lname?: string, phone?: string, pass?: string) {

        function makeid() {
            let text = '';
            let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

            for (let i = 0; i < 6; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }

            return text;
        }

        this._id = _id;
        this.fname = fname;
        this.lname = lname;
        this.phone = phone;
        this.pass = pass || makeid();
    }

    set fname(value: string): void {
        this._fname = value;
        this.setName();
    }

    get fname(value: string): string {
        return this._fname;
    }

    set lname(value: string): void {
        this._lname = value;
        this.setName();
    }

    get lname(value: string): string {
        return this._lname;
    }

    setName(): void {
        if (this.fname && this.lname) {
            this.name = `${this.fname} ${this.lname}`;
        } else if (this.fname) {
            this.name = this.fname;
        } else if (this.lname) {
            this.name = this.lname;
        } else {
            this.name = '';
        }
    }

}
