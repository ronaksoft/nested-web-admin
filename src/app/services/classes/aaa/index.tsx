import Cookies from 'cookies-js';
import AccountApi from './../../../api/account/account';

export default class AAA {
    private hasUserCookie: boolean;
    private nss: string;
    private nsk: string;

    constructor() {
        this.hasUserCookie = this.checkUserCookie();
        this.nss = Cookies.get('nss');
        this.nsk = Cookies.get('nsk');
    }

    getUser(): Promise<any> {
        return new Promise((res, rej) => {
            let accountApi = new AccountApi();
            accountApi.sessionRecall({
                _ss: this.nss,
                _sk: this.nsk,
                _did: 's',
                _dt: 's',
                _do: 's'
            }).then((resp) => {
                res();
            });
            return false;
        });
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
        let nss = Cookies.get('nss');
        let nsk = Cookies.get('nsk');
        return (nss && nsk);
    };

}
