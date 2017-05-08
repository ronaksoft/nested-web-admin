import log from 'loglevel';
import Server from './../services/classes/server/index';

export default class Api {
    private static _instance;
    private server;


    static getInstance() {
        if (!this._instance) {
            this._instance = new Api();
        }

        return this._instance;
    }

    private constructor() {
        this.server = Server.getInstance();
        console.log('Start Api instance');
    }


}
