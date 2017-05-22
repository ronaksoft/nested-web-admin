import Cookies from 'cookies-js';
import AccountApi from './../../../api/account/account';

export default class AAA {
    private static instance : AAA;
    private hasUserCookie: boolean;
    private nss: string;
    private nsk: string;
    private account: any;
    private isAthenticated : boolean = false;


    static getInstance() {
        if (!this.instance) {
            this.instance = new AAA();
        }

        return this.instance;
    }

    getCredentials() {
      return {
        ss : this.nss,
        sk : this.nsk
      };
    }

    setCredentials (d: any) {
        Cookies.set('nss', d._ss);
        Cookies.set('nsk', d._sk);
    }

    setUser(account: any ): void {
        this.account = account;
        this.isAthenticated = true;
    }

    getUser(): any {
        return this.account.account;
    }

    setIsUnAthenticated() : void {
      this.isAthenticated = false;
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


    private constructor() {
        this.hasUserCookie = this.checkUserCookie();
        this.nss = Cookies.get('nss');
        this.nsk = Cookies.get('nsk');
    }

    private checkUserCookie(): boolean {
        let nss = Cookies.get('nss');
        let nsk = Cookies.get('nsk');
        return (nss && nsk);
    };

}
