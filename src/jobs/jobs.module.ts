import { Module } from "@nestjs/common";
import { JobService } from "./jobs.service";
import { PrismaModule } from "../prisma/prisma.module";
import { JobsController } from "./jobs.controller";
import { Gateway } from "./jobs.gateway";

@Module({
    imports: [PrismaModule],
    controllers: [JobsController],
    providers: [JobService, Gateway],
    exports: [JobService, Gateway],
})
export class JobModule {}