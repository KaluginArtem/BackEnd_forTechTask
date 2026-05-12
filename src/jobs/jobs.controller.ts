import {
  Controller, Get, Post, Body, Param,
} from '@nestjs/common';
import { JobService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('jobs')
export class JobsController {
    constructor(private jobService: JobService) {}

    @Get(':id')
    async getOne(@Param('id') id: string) {
        return this.jobService.getJob(id);
    }

    @Throttle({default: {ttl: 60000, limit: 10}})
    @Post()
    async create(@Body() dto: CreateJobDto, ) {
        return this.jobService.createJob(dto.wish, dto.value);
    }

    
}