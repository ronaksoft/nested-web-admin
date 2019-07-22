import Server from './../services/classes/server';
import { setNewConfig } from '../config';

export default class Api {
  static hasCredential: boolean = false;

  static getInstance() {
    if (!this._instance) {
      this._instance = new Api();
    }

    return this._instance;
  }

  private static _instance: any;
  public server: any = new Server();

  public constructor() {
    console.log('Start Api instance');
  }

  public getServer() {
    return this.server;
  }

  static get setHasCredential(): boolean {
    return this.setHasCredential;
  }

  static set setHasCredential(value: boolean) {
    this.setHasCredential = value;
  }

  /**
   * Get end point configs from /getConfig
   * get configs from remote server and if response is `ok`, application config will be replace with new configs
   *
   * @param {string} domain Domain name
   * @returns {Promise<any>}
   */
  public reconfigEndPoints(domain: string): Promise<any> {
    const api: Api = this;
    return new Promise((resolve, reject) => {
      // create request path
      const getConfigUrl = `https://npc.nested.me/dns/discover/${domain}`;

      const xhr = new XMLHttpRequest();
      xhr.open('GET', getConfigUrl, true);

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response: any = JSON.parse(xhr.response);
          let newConfigs: any;
          // try to parse response text
          try {
            newConfigs = this.parseConfigFromRemote(response.data);
          } catch (e) {
            reject();
            return;
          }

          if (response.status === 'ok') {
            // replace configs with new configs
            setNewConfig(domain, newConfigs.websocket, newConfigs.register, newConfigs.store);

            // close server socket and remove current server
            if (api.server) {
              api.server.getSocket().close();
              api.server = null;
              api.server = new Server();
            }

            // store domain of new configs in local storage
            localStorage.setItem('nested.server.domain', domain);
            resolve();
          } else {
            reject();
          }
        } else {
          reject();
        }
      };

      xhr.send();
    });
  }

  private parseConfigFromRemote(data: any) {
    const cyrus: string[] = [];
    const xerxes: string[] = [];
    const admin: string[] = [];
    data.forEach((configs: string) => {
      const config = configs.split(';');
      config.forEach((item: string) => {
        if (item.indexOf('cyrus:') === 0) {
          cyrus.push(item);
        } else if (item.indexOf('xerxes:') === 0) {
          xerxes.push(item);
        }
        if (item.indexOf('admin:') === 0) {
          admin.push(item);
        }
      });
    });
    let cyrusHttpUrl = '';
    let cyrusWsUrl = '';
    let config: any = {};
    cyrus.forEach(item => {
      config = this.parseConfigData(item);
      if (config.protocol === 'http' || config.protocol === 'https') {
        cyrusHttpUrl = this.getCompleteUrl(config);
      } else if (config.protocol === 'ws' || config.protocol === 'wss') {
        cyrusWsUrl = this.getCompleteUrl(config);
      }
    });

    return {
      websocket: cyrusWsUrl + '/api',
      register: cyrusHttpUrl + '/api',
      store: cyrusHttpUrl + '/file',
    };
  }

  private parseConfigData(data: any) {
    const items = data.split(':');
    return {
      name: items[0],
      protocol: items[1],
      port: items[2],
      url: items[3],
    };
  }

  private getCompleteUrl(config: any) {
    return config.protocol + '://' + config.url + ':' + config.port;
  }
}
