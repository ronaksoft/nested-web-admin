import Api from './../index';
import moment from 'moment';
import CONFIG from '../../config';
import AAA from './../../services/classes/aaa/index';

export default class FileApi {
  private api: Api;
  private TOKEN_TIMESTAMP_SEPARATOR: string = '-';
  private token: string = '';

  constructor() {
    this.api = Api.getInstance();
  }

  isTokenValid(token: string) {
    if (!token) {
      return false;
    }

    const timestamp = token.split(this.TOKEN_TIMESTAMP_SEPARATOR).pop();
    if (!timestamp) {
      console.error('Could not find an expire timestamp at the end of the token!');
      return false;
    }

    const expire = moment(timestamp);
    if (!expire.isValid()) {
      console.error('Invalid expire timestamp at the end of token!');
      return false;
    }

    return moment().isSameOrBefore(expire);
  }

  getUploadUrl(): Promise<any> {
    const credentials = AAA.getInstance().getCredentials();
    const url = `${CONFIG().STORE.URL}/upload/${credentials.sk}/{token}`;

    if (this.isTokenValid(this.token)) {
      return Promise.resolve(url.replace('{token}', this.token));
    }

    return new Promise((resolve, reject) => {
      this.api.server
        .request({
          cmd: 'file/get_upload_token',
          data: {},
        })
        .then((result: any) => {
          this.token = result.token;
          resolve(url.replace('{token}', this.token));
        }, reject);
    });
  }
}
