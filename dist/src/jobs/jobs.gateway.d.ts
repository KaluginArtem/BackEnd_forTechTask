import { Server } from "socket.io";
export declare class Gateway {
    server: Server;
    sendProgress(jobId: string, progress: number): void;
}
