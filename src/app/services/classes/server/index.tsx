import socket from './../socket/index';
import CErrors from './consts/CErrors';
import IRequest from './interfaces/IRequest';
import IResponse from './interfaces/IResponse';
import ISocketRequest from './interfaces/ISocketRequest';
import AAA from './../aaa/index';
import CONFIG from 'src/app/config';
import SocketState from '../socket/states';
import Client from './../client/index';
export default class Server {
    private static instance: Server;
    private socket: any = null;
    private queue: Array<any>;
    private reqId: number = Date.now();
    private cid: string;
    private sk: string;


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
            req._reqid = this.getRequestId();
        }

        let socketRequest: ISocketRequest = {
            ...req,
            _cver: CONFIG().APP_VERSION,
            _cid: this.cid
        };


        if (req.cmd === 'session/register' && req.cmd === 'session/recall') {
            if (credential.sk && credential.sk !== 'null') {
                socketRequest._sk = credential.sk;
            }

            if (credential.ss && credential.ss !== 'null') {
                socketRequest._ss = credential.ss;
            }
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
            state: 0,
            reqId: req._reqid,
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
