import { Injectable, Logger, Inject } from '@nestjs/common';
import axios from 'axios';
import { DigiApiResponse } from '~/interfaces/external/digiapi-response.interface';
import Redis from 'ioredis';

@Injectable()
export class DigiapiService {
  private readonly logger = new Logger(DigiapiService.name);

  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}


  async getDigimon(endpoint: string, baseUrl?: string) {
    await this.redis.set('test-key', 'it works', 'EX', 60);
    const value = await this.redis.get('test-key');
    console.log('Redis test value:', value);
    const cacheKey = `digiapi:${endpoint}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      this.logger.log(`Cache hit for ${cacheKey}`);
      return JSON.parse(cached);
    }
    try {
      const url = `${baseUrl || 'https://digi-api.com/api/v1'}/${endpoint}`;
      this.logger.log(`Requesting DigiAPI endpoint: ${url}`);
      const response = await axios.get(url);
      // Si el endpoint es 'digimon/<id>' se puede mapear como antes
      if (endpoint.startsWith('digimon/')) {
        const digimon = response.data as DigiApiResponse;
        const result = {
          name: digimon.name,
          weight: undefined,
          powers: (digimon.levels || []).map((l) => l.level),
          evolutions: (digimon.nextEvolutions || []).map((e) => e.digimon)
        };
        await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 3600);
        return result;
      }
      // Para otros endpoints, retorna el resultado crudo
      await this.redis.set(cacheKey, JSON.stringify(response.data), 'EX', 3600);
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching Digimon data', error);
      throw error;
    }
  }
}
