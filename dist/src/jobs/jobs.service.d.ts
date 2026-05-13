import { Job } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { Gateway } from "./jobs.gateway";
export declare class JobService {
    private prisma;
    private gateway;
    constructor(prisma: PrismaService, gateway: Gateway);
    createJob(jobWish: string, jobValue: number): Promise<{
        progress: number;
        id: string;
        status: import("@prisma/client").$Enums.Status;
        result: import("@prisma/client/runtime/client").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateJob(jobId: string, data: Partial<Job>): Promise<{
        progress: number;
        id: string;
        status: import("@prisma/client").$Enums.Status;
        result: import("@prisma/client/runtime/client").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getJob(jobId: string): Promise<{
        progress: number;
        id: string;
        status: import("@prisma/client").$Enums.Status;
        result: import("@prisma/client/runtime/client").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
}
