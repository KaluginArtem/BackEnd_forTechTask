"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const jobs_gateway_1 = require("./jobs.gateway");
const pipeline_1 = require("../pipeline/pipeline");
let JobService = class JobService {
    prisma;
    gateway;
    constructor(prisma, gateway) {
        this.prisma = prisma;
        this.gateway = gateway;
    }
    async createJob(jobWish, jobValue) {
        const job = await this.prisma.job.create({
            data: {
                result: {
                    wish: jobWish,
                    value: jobValue,
                }
            }
        });
        await this.updateJob(job.id, { status: "processing" });
        (0, pipeline_1.runPipeline)(async (progress) => {
            await this.updateJob(job.id, { progress });
            this.gateway.sendProgress(job.id, progress);
        }).then(async () => {
            await this.updateJob(job.id, { status: "done" });
        });
        setTimeout(async () => {
            const currentJob = await this.getJob(job.id);
            if (currentJob?.status == 'processing') {
                await this.updateJob(job.id, { status: 'failed' });
            }
        }, 2 * 60 * 1000);
        return job;
    }
    async updateJob(jobId, data) {
        return await this.prisma.job.update({
            where: { id: jobId },
            data: {
                status: data.status,
                progress: data.progress,
            }
        });
    }
    async getJob(jobId) {
        return await this.prisma.job.findUnique({
            where: { id: jobId }
        });
    }
};
exports.JobService = JobService;
exports.JobService = JobService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, jobs_gateway_1.Gateway])
], JobService);
//# sourceMappingURL=jobs.service.js.map