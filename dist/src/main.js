"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
class CorsIoAdapter extends platform_socket_io_1.IoAdapter {
    createIOServer(port, options) {
        return super.createIOServer(port, {
            ...options,
            cors: { origin: process.env.FRONTEND_URL, credentials: true }
        });
    }
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useWebSocketAdapter(new CorsIoAdapter(app));
    app.enableCors({ origin: process.env.FRONTEND_URL });
    app.useGlobalPipes(new common_1.ValidationPipe());
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map