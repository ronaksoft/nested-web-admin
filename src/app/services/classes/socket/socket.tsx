import log from 'logLevel';

import {ISocketConfig} from './interfaces';

const defaultConfig: ISocketConfig = {
    server: '',
    pingPongTime: 100,
};

export default class socket {

    private config: ISocketConfig;
    private socket: any | null;
    private pingPong: any;

    constructor(config: ISocketConfig = defaultConfig) {
        if (config.server === '') {
            throw 'WebSocket Server isn\'t declared!';
        }
        this.config = config;
    }

    private onOpen() {
        log.info('socket', 'Connection stabilised to ', this.config.server);
        this.startPingPong();
    }

    private onClose() {
        log.info('socket', 'Connection closed!');
        this.stopPingPong();
    }

    private onError(error: any) {
        log.error('socket', 'error', error);
        this.startPingPong();
    }

    private onMessage(msg: string) {
        if (this.config.onMessage) {
            this.config.onMessage(msg);
        }
    }

    private startPingPong() {
        if (this.pingPong) {
            this.pingPong = setInterval(() => {
                this.send('PING!');
            }, this.config.pingPongTime);
        }
    }

    private stopPingPong() {
        if (this.pingPong) {
            this.pingPong();
            this.pingPong = null;
        }
    }

    send(msg: any) {
        this.socket.send(msg);
    }

    connect() {
        this.socket = new WebSocket(this.config.server);
        this.socket.onopen = this.onOpen;
        this.socket.onclose = this.onClose;
        this.socket.onmessage = this.onMessage;
        this.socket.onerror = this.onError;
    }

}