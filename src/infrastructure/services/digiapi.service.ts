import { Injectable, Logger, Inject } from '@nestjs/common';
import axios from 'axios';
import { DigiApiResponse } from '~/interfaces/external/digiapi-response.interface';
import Redis from 'ioredis';

@Injectable()
export class DigiapiService {
  private isDigiApiDigimon(data: any): data is DigiApiResponse {
    return (data && typeof data === 'object' && 'name' in data);
  }
  private readonly logger = new Logger(DigiapiService.name);

  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}


  private buildDigiApiEndpoint(metadata: Record<string, any>): string {
    if (metadata.name) {
      return `digimon/${metadata.name}`;
    }
    const keys = Object.keys(metadata);
    if (keys.length > 0) {
      const key = keys[0];
      return `${key}/${metadata[key]}`;
    }
    throw new Error('No endpoint or parameter provided for DigiAPI');
  }

  async getDigimon(metadata: Record<string, any>) {
    const endpoint = this.buildDigiApiEndpoint(metadata);
    const cacheKey = `digiapi:${endpoint}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      this.logger.log(`Cache hit for ${cacheKey}`);
      return JSON.parse(cached);
    }
    try {
      const url = `${process.env.DIGIAPI_BASE_URL}/${endpoint}`;
      this.logger.log(`Requesting DigiAPI endpoint: ${url}`);
      const response = await axios.get(url);
      const data = response.data;

      if (this.isDigiApiDigimon(data)) {
        const result = {
          name: data.name,
          weight: undefined,
          powers: (data.levels || []).map((l) => l.level),
          evolutions: (data.nextEvolutions || []).map((e) => e.digimon)
        };
        await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 3600);
        return result;
      }
      await this.redis.set(cacheKey, JSON.stringify(data), 'EX', 3600);
      return data;
    } catch (error) {
      this.logger.error('Error fetching Digimon data', error);
      throw error;
    }
  }
}
