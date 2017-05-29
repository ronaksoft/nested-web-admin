import log from 'loglevel';

import {ISocketConfig} from './interfaces';
import SocketState from './states';

const defaultConfig: ISocketConfig = {
  server: '',
  pingPongTime: 30000,
};

export default class Socket {

  private config: ISocketConfig;
  private socket: any | null;
  private pingPongInterval: any = null;
  private pingPongCounter: number = 0;
  private reconnectTimeout: any = null;

  constructor(config: ISocketConfig = defaultConfig) {
    if (config.server === '') {
      throw 'WebSocket Server isn\'t declared!';
    }
    this.config = config;
  }

  send(msg: any) {
    if (this.socket && this.socket.readyState === SocketState.OPEN) {
      this.socket.send(msg);
    }
  }

  isReady() {
    return this.socket.readyState === SocketState.OPEN;
  }

  connect() {
    this.cancelReconnect();
    this.socket = new WebSocket(this.config.server);
    this.socket.onopen = this.onOpen.bind(this);
    this.socket.onclose = this.onClose.bind(this);
    this.socket.onmessage = this.onMessage.bind(this);
    this.socket.onerror = this.onError.bind(this);
  }

  close() {
    if (this.socket.readyState === SocketState.CLOSING) {
        console.log('The socket is being closed.');
      } else if (this.socket.readyState === SocketState.CLOSED) {
        console.log('The socket has already been closed.');
      } else {
        this.socket.close(1000, 'The socked has ben closed intentially.');
        this.stopPingPong();
      }
  }

  private onOpen() {
    log.info('socket', 'Connection stabilised to ', this.config.server);
    setTimeout(() => {
      this.config.onReady();
      this.startPingPong();
    }, 100);
  }

  private onClose() {
    console.log('socket', 'Connection closed!');
    this.stopPingPong();
    this.reconnect();
  }

  private onError(error: any) {
    log.error('socket', 'error', error);
    if (this.socket) {
      this.socket.close();
    }

    this.stopPingPong();
    this.reconnect();
  }

  private onMessage(msg: any) {
    if (this.config.onMessage && msg.data !== 'PONG!') {
      this.config.onMessage(msg.data);
    } else if (msg.data === 'PONG!') {
      this.pingPongCounter = 0;
    }
  }

  private startPingPong() {
    this.stopPingPong();

    this.pingPongInterval = setInterval(() => {
      this.send('PING!');
      this.pingPongCounter++;

      if (this.pingPongCounter > 3) {
        this.close();
        this.reconnect();
      }

    }, this.config.pingPongTime);
  }

  private stopPingPong() {
    if (this.pingPongInterval) {
      clearInterval(this.pingPongInterval);
    }
  }

  private reconnect() {
    if (this.socket.readyState === SocketState.OPEN || this.socket.readyState === SocketState.CONNECTING) {
      this.socket.close();
    }

    this.reconnectTimeout = setTimeout(this.connect.bind(this), 5000);
  }

  private cancelReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
  }

}
