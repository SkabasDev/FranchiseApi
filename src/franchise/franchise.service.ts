import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
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
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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
      if (!(await this.cacheManager.get(logKey))) {
        const requestLog = new RequestLog();
        requestLog.franchise = franchise;
        requestLog.version = version;
        requestLog.metadata = metadata;
        requestLog.timestamp = new Date();
        requestLog.status = status;
        requestLog.error_message = error_message ?? "";
        await this.requestLogRepository.save(requestLog);
        await this.cacheManager.set(logKey, true, 60 * 60);
      }
    }
  }
}