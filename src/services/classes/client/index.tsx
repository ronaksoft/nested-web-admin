import * as Cookies from 'cookies-js';
import Platform from 'react-platform-js';
class Client {
  public static getCid() {
    let cid = Cookies.get('ncid');

    if (!cid) {
      cid = ['Web', 'desktop', Platform.Browser, Platform.OS].join('_');
      Client.setCid(cid);
    }

    return cid;
  }

  public static setCid(cid: string): void {
    if (!cid) {
      Cookies.set('ncid', '');
      return;
    }

    Cookies.set('ncid', cid, { expires: Client.getNextMonthDate() });
  }

  public static getDid(): string {
    const did = Cookies.get('ndid');
    if (did) {
      return did;
    }

    return 'web_' + Date.now() + '-' + Client.guid() + '-' + Client.guid();
  }

  public static setDid(did: string): void {
    if (!did) {
      Cookies.set('ndid', '');
      return;
    }

    Cookies.set('ndid', did, { expires: Client.getNextMonthDate() });
  }

  public static getDt(): string {
    return Cookies.get('ndt');
  }

  public static setDt(dt: string): void {
    if (!dt) {
      Cookies.set('ndt', '');
      return;
    }

    Cookies.set('ndt', dt, { expires: Client.getNextMonthDate() });
  }

  public static getDo(): string {
    return Cookies.get('ndo');
  }

  public static setDo(os: string): void {
    if (!os) {
      Cookies.set('ndo', '');
      return;
    }

    Cookies.set('ndo', os, { expires: Client.getNextMonthDate() });
  }

  private static guid(): string {
    const s4 = (): string => {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    };

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  private static getNextMonthDate() {
    return new Date(Date.now() + 7 * 1000 * 60 * 60 * 24);
  }
}

export default Client;
