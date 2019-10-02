import socket from './../socket/index';
import IRequest from './interfaces/IRequest';
import ISocketRequest from './interfaces/ISocketRequest';
import AAA from './../aaa/index';
import CONFIG from '../../../config';
import SocketState from '../socket/states';
import Client from './../client/index';
export default class Server {
  static getInstance() {
    if (!Server.instance) {
      Server.instance = new Server();
    }
    return Server.instance;
  }
  private static instance: Server;
  private socket: any = null;
  private queue: any[];
  private reqId: number = Date.now();
  private cid: string;

  public constructor() {
    console.log('Start Server instance');
    this.socket = new socket({
      server: CONFIG().WEBSOCKET.URL,
      pingPongTime: 10000,
      onReady: this.startQueue.bind(this),
      onMessage: this.response.bind(this),
    });
    this.queue = [];
    this.socket.connect();
    this.cid = Client.getCid();
  }
  request(req: IRequest): Promise<unknown> {
    const aaa = AAA.getInstance();
    const credential = aaa.getCredentials();
    if (!req._reqid) {
      req._reqid = this.getRequestId();
    }

    const socketRequest: ISocketRequest = {
      _sk: null,
      _ss: null,
      ...req,
      _cver: CONFIG().APP_VERSION,
      _cid: this.cid,
    };

    if (req.cmd !== 'session/register' && req.cmd !== 'session/recall') {
      if (credential.sk && credential.sk !== 'null') {
        socketRequest._sk = credential.sk;
      }

      if (credential.ss && credential.ss !== 'null') {
        socketRequest._ss = credential.ss;
      }
    }

    let internalResolve;
    let internalReject;

    const promise = new Promise((res, rej) => {
      internalResolve = res;
      internalReject = rej;

      if (this.socket.isReady()) {
        this.socket.send(JSON.stringify(socketRequest));
      }
    });

    this.queue.push({
      reqId: req._reqid,
      state: 0,
      resolve: internalResolve,
      reject: internalReject,
      request: socketRequest,
    });

    return promise;
  }

  getRequestId(): string {
    this.reqId++;
    return 'REQ' + this.reqId;
  }

  onConnectionStateChange(callback: (state: SocketState) => void) {
    this.socket.onStateChanged = callback;
  }

  public getSocket() {
    return this.socket;
  }

  private response(res: string): void {
    const response = JSON.parse(res);

    // try to find queued request
    const queueItem = this.queue.findIndex(q => {
      return q.reqId === response._reqid;
    });

    // check for has request in queue
    // return if has any request with this
    if (queueItem === -1) {
      return;
    }

    // resole request
    if (response.status === 'ok') {
      this.queue[queueItem].resolve(response.data);
    } else {
      this.queue[queueItem].reject(response.data);
    }

    // remove request from queue
    this.queue.splice(queueItem, 1);
  }

  private sendRequest(request: any) {
    this.socket.send(JSON.stringify(request.request));
  }

  private startQueue() {
    this.queue.forEach(request => {
      if (request.state === 0) {
        this.sendRequest(request);
      }
    });
  }
}
