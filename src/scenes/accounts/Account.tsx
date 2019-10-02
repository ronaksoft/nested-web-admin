import IUser from '../../interfaces/IUser';
import IGender from '../../interfaces/IGender';
import IPicture from '../../interfaces/IPicture';

export default class Account implements IUser {
  private static setName() {
    if (this.fname && this.lname) {
      this.fullName = `${this.fname} ${this.lname}`;
    } else if (this.fname) {
      this.fullName = this.fname;
    } else if (this.lname) {
      this.fullName = this.lname;
    } else {
      this.fullName = '';
    }
  }
  public _id: string = '';
  public fname: string = '';
  public lname: string = '';
  public fullName: string = '';
  public phone: string = '';
  public pass: string = '';
  public dob: string = '';
  public email: string = '';
  public admin: boolean = false;
  public disabled: boolean = false;
  public gender: IGender = IGender.male;
  public picture: IPicture = {
    orginal: '',
    x128: '',
    x256: '',
    x32: '',
    x64: '',
  };

  constructor(_id?: string, fname?: string, lname?: string, phone?: string, pass?: string) {
    function makeid() {
      let text = '';
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

      for (let i = 0; i < 6; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }

      return text;
    }

    if (_id) {
      this._id = _id;
    }
    if (fname) {
      this.fname = fname;
    }
    if (lname) {
      this.lname = lname;
    }
    if (phone) {
      this.phone = phone;
    }
    this.pass = pass || makeid();
  }

  static get fname(): string {
    return this.fname;
  }

  static set fname(value: string) {
    this.fname = value;
    this.setName();
  }

  static set lname(value: string) {
    this.lname = value;
    this.setName();
  }

  static get lname(): string {
    return this.lname;
  }

  static set fullName(value: string) {
    this.fullName = value;
  }
}
