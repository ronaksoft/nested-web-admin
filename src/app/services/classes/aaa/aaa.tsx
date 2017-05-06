import Cookies from 'cookies-js';

export default class AAA {
    getUser(): any {
        return false;
    }

    hasUser(): boolean {
        return this.checkUserCookie();
    }

    checkUserCookie(): boolean {
        let nss = Cookies.get('nss');
        let nsk = Cookies.get('nsk');
        return (nss && nsk);
    };

}
