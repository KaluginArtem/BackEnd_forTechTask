import { JobService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
export declare class JobsController {
    private jobService;
    constructor(jobService: JobService);
    getOne(id: string): Promise<{
        progress: number;
        id: string;
        status: import("@prisma/client").$Enums.Status;
        result: import("@prisma/client/runtime/client").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(dto: CreateJobDto): Promise<{
        progress: number;
        id: string;
        status: import("@prisma/client").$Enums.Status;
        result: import("@prisma/client/runtime/client").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
