import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestLog } from '~/infrastructure/models/request-log.model';
import { Repository } from 'typeorm';
import { FranchiseContextService } from './strategies/franchise-context.service';

@Injectable()
export class FranchiseService {
  constructor(
    @InjectRepository(RequestLog)
    private readonly requestLogRepository: Repository<RequestLog>,
    private readonly context: FranchiseContextService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  async getFranchiseData(franchise: string, version: string, metadata: any, config: any) {
    let status = 'success';
    let error_message: string | null = null;
    let response: any = null;
    try {
      // Delegar la lógica de obtención de datos a la estrategia adecuada
      const strategy = this.context.getStrategy(franchise);
      response = await strategy.getData(metadata, config);
      return response;
    } catch (error) {
      status = 'error';
      error_message = error.message;
      throw error;
    } finally {
      // Evitar registros duplicados en la base de datos usando cache
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