import log from 'loglevel';
import socket from './../socket/index';
import CErrors from './consts/CErrors';
import IRequest from './interfaces/IRequest';
import IResponse from './interfaces/IResponse';
import ISocketRequest from './interfaces/ISocketRequest';
import AAA from './../aaa/index';


export default class Server {
    private static instance: Server;
    private socket: any = null;
    private queue: Array<any>;
    private reqId: number = Date.now();
    private sk: string;
    private ss: string;

    static getInstance() {
        if (!Server.instance) {
            Server.instance = new Server();
        }

        return Server.instance;
    }


    request(req: IRequest): Promise<{}> {

        let aaa = AAA.getInstance();
        const credential = aaa.getCredentials();
        if (!req._reqid) {
            req._reqid =  this.getRequestId();
        }

        let socketRequest: ISocketRequest = {
            ...req
        };


        if (credential.sk) {
          socketRequest._sk = credential.sk;
        }

        if (credential.ss) {
          socketRequest._ss = credential.ss;
        }



        let internalResolve,
            internalReject;

        let promise = new Promise((res, rej) => {
            internalResolve = res;
            internalReject = rej;

            if (this.socket.isReady()) {
                this.socket.send(JSON.stringify(socketRequest));
            }
        });

        this.queue.push({
            state   : 0,
            reqId   : req._reqid,
            resolve : internalResolve,
            reject  : internalReject,
            request : socketRequest,
        });

        return promise;
    }

    getRequestId(): string {
        this.reqId++;
        return 'REQ' + this.reqId;
    }

    private constructor() {
        console.log('Start Server instance');
        this.socket = new socket({
            server: 'ws://cyrus.ronaksoftware.com:81/',
            pingPongTime: 50000,
            onReady : this.startQueue.bind(this),
            onMessage: this.response.bind(this),
        });
        this.queue = [];
        this.socket.connect();
    }

    private response(res: string): void {
        let response = JSON.parse(res);

        // try to find queued request
        let queueItem = this.queue.findIndex((q) => {
          return q.reqId === response._reqid;
        });

        // check for has request in queue
        // return if has any request with this
        if (queueItem === -1) {
            return;
        }


        // resole request
        this.queue[queueItem].resolve(response.data);

        // remove request from queue
        this.queue.splice(queueItem, 1);


    }

    private sendRequest(request: any) {
      this.socket.send(JSON.stringify(request.request));
    }

    private startQueue() {
        this.queue.map((request) => {
            if (request.state === 0) {
                this.sendRequest(request);
            }
        });
    }
}
