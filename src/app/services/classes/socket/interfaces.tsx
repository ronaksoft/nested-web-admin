export interface ISocketConfig {
    server: string;
    pingPongTime ?: number;
    onMessage?: IOnMessageFunction;
}

interface IOnMessageFunction {
    (message: string): void;
}

