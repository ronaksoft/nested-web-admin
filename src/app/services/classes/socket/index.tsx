import log from 'loglevel';

import {ISocketConfig} from './interfaces';

const defaultConfig: ISocketConfig = {
  server: '',
  pingPongTime: 50000,
};

export default class Socket {

  private config: ISocketConfig;
  private socket: any | null;
  private pingPong: any = null;
  private pingPongCounter: number = 0;
  private reconnectIntervalCanceler;

  constructor(config: ISocketConfig = defaultConfig) {
    if (config.server === '') {
      throw 'WebSocket Server isn\'t declared!';
    }
    this.config = config;
  }

  send(msg: any) {
    this.socket.send(msg);
  }

  isReady() {
    if (this.pingPong) {
      return true;
    } else {
      return false;
    }
  }

  connect() {
    if (this.socket) {
      return;
    }
    if (this.reconnectIntervalCanceler) {
      clearInterval(this.reconnectIntervalCanceler);
    }
    if (this.pingPong) {
      clearInterval(this.pingPong);
    }

    this.socket = new WebSocket(this.config.server);
    this.socket.onopen = this.onOpen.bind(this);
    this.socket.onclose = this.onClose.bind(this);
    this.socket.onmessage = this.onMessage.bind(this);
    this.socket.onerror = this.onError.bind(this);
  }

  private onOpen() {
    log.info('socket', 'Connection stabilised to ', this.config.server);
    this.startPingPong();
    setTimeout(() => {
      this.config.onReady();
    }, 100);
  }

  private onClose() {
    console.log('socket', 'Connection closed!');
    this.socket = null;
    this.stopPingPong();
    this.reconnect();
  }

  private onError(error: any) {
    log.error('socket', 'error', error);
    this.socket = null;
    this.stopPingPong();
    this.reconnect();
  }

  private onMessage(msg: any) {
    if (this.config.onMessage && msg.data !== 'PONG!') {
      this.config.onMessage(msg.data);
    } else if (msg.data !== 'PONG!') {
      this.pingPongCounter = 0;
    }
  }

  private startPingPong() {
    console.log(this.pingPong, this.pingPongCounter);
    if (!this.pingPong && this.pingPongCounter <= 3) {
      this.pingPong = setInterval(() => {
        this.send('PING!');
        this.pingPongCounter++;
      }, this.config.pingPongTime);
    } else if (this.pingPongCounter > 3) {
      this.onClose();
    }
  }

  private stopPingPong() {
    if (this.pingPong) {
      clearInterval(this.pingPong);
    }
    this.pingPong = null;
  }

  private reconnect() {
    if (this.socket === null) {
      this.reconnectIntervalCanceler = setInterval(() => {
        if (this.socket !== null) {
          clearInterval(this.reconnectIntervalCanceler);
        }
        this.connect();
      }, 5000);
    }
  }

}
