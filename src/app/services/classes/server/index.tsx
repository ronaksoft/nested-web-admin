import log from 'loglevel';
import socket from './../socket/index';
import CErrors from './consts/CErrors';
import IRequest from './interfaces/IRequest';
import IResponse from './interfaces/IResponse';
import ISocketRequest from './interfaces/ISocketRequest';


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

        if (!req._reqid) {
            req._reqid =  this.getRequestId();
        }

        let socketRequest: ISocketRequest = {
            ...req
        };

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

    setSessionKey(ss: string) {
        this.ss = ss;
    }

    setSessionSecret(sk: string) {
        this.sk = sk;
    }

    private constructor() {
        console.log('Start Server instance');
        this.socket = new socket({
            server: 'ws://cyrus.ronaksoftware.com:81/',
            pingPongTime: 1000,
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

    private startQueue() {
        this.queue.map((request) => {
            if (request.state === 0) {
                this.socket.send(JSON.stringify(request.request));
            }
        });
    }
}
