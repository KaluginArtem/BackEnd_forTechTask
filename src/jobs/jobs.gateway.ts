import {WebSocketGateway, WebSocketServer} from "@nestjs/websockets"
import {Server} from "socket.io"

@WebSocketGateway({
    cors: {origin: process.env.FRONTEND_URL }
})
export class Gateway {
    @WebSocketServer()
    server: Server;

    sendProgress(jobId: string, progress: number) {
        this.server.emit('progress', {jobId, progress});
    }
}