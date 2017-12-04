import log from 'loglevel';
import {forEach, startsWith} from 'lodash';
import Server from './../services/classes/server/index';
import {setNewConfig} from 'src/app/config';

export default class Api {
    static hasCredential : boolean = false;
    private static _instance;
    private server;

    static getInstance() {
        if (!this._instance) {
            this._instance = new Api();
        }

        return this._instance;
    }

    public getServer() {
        return this.server;
    }

    setHasCredential(value : boolean) {
        this.setHasCredential(value);
    }

    getHasCredential() {
        return this.setHasCredential;
    }

    public constructor() {
        this.server = new Server();
        console.log('Start Api instance');
    }

    /**
     * Get end point configs from /getConfig
     * get configs from remote server and if response is `ok`, application config will be replace with new configs
     *
     * @param {string} domain Domain name
     * @returns {Promise<any>}
     */
    public reconfigEndPoints(domain: string): Promise<any> {
        console.log(domain);
        const api = this;
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
                        setNewConfig(
                            domain,
                            newConfigs.websocket,
                            newConfigs.register,
                            newConfigs.store,
                        );

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
        const cyrus = [];
        const xerxes = [];
        const admin = [];
        forEach(data, (configs) => {
            const config = configs.split(';');
            forEach(config, (item) => {
                if (startsWith(item, 'cyrus:')) {
                    cyrus.push(item);
                } else if (startsWith(item, 'xerxes:')) {
                    xerxes.push(item);
                }
                if (startsWith(item, 'admin:')) {
                    admin.push(item);
                }
            });
        });
        let cyrusHttpUrl = '';
        let cyrusWsUrl = '';
        let xerxesUrl;
        let config: any = {};
        forEach(cyrus, (item) => {
            config = this.parseConfigData(item);
            if (config.protocol === 'http' || config.protocol === 'https') {
                cyrusHttpUrl = this.getCompleteUrl(config);
            } else if (config.protocol === 'ws' || config.protocol === 'wss') {
                cyrusWsUrl = this.getCompleteUrl(config);
            }
        });
        xerxesUrl = this.getCompleteUrl(this.parseConfigData(xerxes[0]));

        return {
            websocket: cyrusWsUrl,
            register: cyrusHttpUrl,
            store: xerxesUrl,
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
