import Cookies from 'cookies-js';

export default class AAA {
  static getInstance() {
    if (!this.instance) {
      this.instance = new AAA();
    }
    return this.instance;
  }

  private static instance: AAA;
  private hasUserCookie: boolean;
  private nss: string;
  private nsk: string;
  private account: any;
  private isAthenticated: boolean = false;

  private constructor() {
    this.hasUserCookie = this.checkUserCookie();
    this.nss = Cookies.get('nss');
    this.nsk = Cookies.get('nsk');
  }

  getCredentials() {
    this.nss = Cookies.get('nss');
    this.nsk = Cookies.get('nsk');
    return {
      ss: this.nss,
      sk: this.nsk,
    };
  }

  setCredentials(credential: any) {
    Cookies.set('nss', credential._ss);
    Cookies.set('nsk', credential._sk);
    this.nss = credential._ss;
    this.nsk = credential._sk;
    this.hasUserCookie = this.checkUserCookie();
  }

  setUser(account: any): void {
    this.account = account;
    this.isAthenticated = true;
  }

  getUser(): any {
    return this.account;
  }

  setIsUnAthenticated(): void {
    this.isAthenticated = false;
    this.setCredentials({
      _ss: '',
      _sk: '',
    });
    this.account = null;
  }

  hasUser(): Promise<boolean> {
    return new Promise((res, rej) => {
      if (this.checkUserCookie()) {
        res(false);
      } else {
        res(false);
      }
    });
  }

  private checkUserCookie(): boolean {
    const nss = Cookies.get('nss');
    const nsk = Cookies.get('nsk');
    return !!(nss && nsk);
  }
}
