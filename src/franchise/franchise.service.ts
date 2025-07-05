import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestLog } from '~/infrastructure/models/request-log.model';
import { Repository } from 'typeorm';
import { FranchiseContextService } from './strategies/franchise-context.service';
import { ApiStatus } from '~/common/constants/api-status.enum';

@Injectable()
export class FranchiseService {
  constructor(
    @InjectRepository(RequestLog)
    private readonly requestLogRepository: Repository<RequestLog>,
    private readonly context: FranchiseContextService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  async getFranchiseData(franchise: string, version: string, metadata: any, config: any, metadataError?: string) {
    let status = ApiStatus.SUCCESS;
    let error_message: string | null = null;
    let response: any = null;

    if (metadataError) {
      status = ApiStatus.ERROR;
      error_message = metadataError;
      const logKey = `log:${franchise}:${version}:${JSON.stringify(metadata)}`;
      if (!(await this.redis.get(logKey))) {
        const requestLog = new RequestLog();
        requestLog.franchise = franchise;
        requestLog.version = version;
        requestLog.metadata = metadata;
        requestLog.timestamp = new Date();
        requestLog.status = status;
        requestLog.error_message = error_message;
        await this.requestLogRepository.save(requestLog);
        await this.redis.set(logKey, '1', 'EX', 60 * 60);
      }
      return { message: metadataError };
    }

    try {
      const strategy = this.context.getStrategy(franchise);
      response = await strategy.getData(metadata, config);
      return response;
    } catch (error) {
      status = ApiStatus.ERROR;
      error_message = error?.response?.data?.message || error.message || 'Unknown error';
      return { message: 'External API error', details: error_message };
    } finally {
      const logKey = `log:${franchise}:${version}:${JSON.stringify(metadata)}`;
      if (!(await this.redis.get(logKey))) {
        const requestLog = new RequestLog();
        requestLog.franchise = franchise;
        requestLog.version = version;
        requestLog.metadata = metadata;
        requestLog.timestamp = new Date();
        requestLog.status = status;
        requestLog.error_message = error_message ?? "";
        await this.requestLogRepository.save(requestLog);
        await this.redis.set(logKey, '1', 'EX', 60 * 60);
      }
    }
  }
}