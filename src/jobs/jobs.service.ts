import { Injectable } from "@nestjs/common";
import { Job } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { Gateway } from "./jobs.gateway";
import { runPipeline } from "../pipeline/pipeline";

@Injectable()
export class JobService {
    constructor(private prisma: PrismaService, private gateway: Gateway) {}

    async createJob(jobWish: string, jobValue: number) {
        const job = await this.prisma.job.create({
            data: {
                result: {
                    wish: jobWish,
                    value: jobValue,
                }
            }
        });
        await this.updateJob(job.id, {status: "processing"});
        runPipeline(async (progress) => {
            await this.updateJob(job.id, {progress});
            this.gateway.sendProgress(job.id, progress);
        }).then(async () => {
            await this.updateJob(job.id, {status: "done"});
        });
        setTimeout(async () => {
            const currentJob = await this.getJob(job.id);
            if(currentJob?.status == 'processing') {
                await this.updateJob(job.id, {status: 'failed'})
            }
        }, 2 * 60 * 1000);
        return job;
    }

    async updateJob(jobId: string, data: Partial<Job>) {
        return await this.prisma.job.update({
            where: {id: jobId},
            data: {
                status: data.status,
                progress: data.progress,
            }
        })
    }

    async getJob(jobId: string) {
        return await this.prisma.job.findUnique({
            where: {id: jobId}
        });
    }
}