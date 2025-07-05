import { Injectable, Logger, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import axios from 'axios';
import { DigiApiResponse } from '~/interfaces/external/digiapi-response.interface';

@Injectable()
export class DigiapiService {
  private readonly logger = new Logger(DigiapiService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getDigimon(endpoint: string, baseUrl?: string) {
    const cacheKey = `digiapi:${endpoint}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      this.logger.log(`Cache hit for ${cacheKey}`);
      return cached;
    }
    try {
      const url = `${baseUrl || 'https://digi-api.com/api/v1'}/${endpoint}`;
      this.logger.log(`Requesting DigiAPI endpoint: ${url}`);
      const response = await axios.get(url);
      // Si el endpoint es 'digimon/<id>' se puede mapear como antes
      if (endpoint.startsWith('digimon/')) {
        const digimon = response.data as DigiApiResponse;
        return {
          name: digimon.name,
          weight: undefined,
          powers: (digimon.levels || []).map((l) => l.level),
          evolutions: (digimon.nextEvolutions || []).map((e) => e.digimon)
        };
      }
      // Para otros endpoints, retorna el resultado crudo
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching Digimon data', error);
      throw error;
    }
  }
}
