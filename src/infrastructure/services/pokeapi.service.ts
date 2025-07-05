import { Injectable, Inject, Logger } from '@nestjs/common';
import axios from 'axios';
import { Redis } from 'ioredis';
import { PokeApiPokemon } from '~/interfaces/external/pokeapi-response.interface';

@Injectable()
export class PokeapiService {
  private isPokeApiPokemon(data: any): data is PokeApiPokemon {
    return (data && typeof data === 'object' && 'species' in data && 'types' in data && 'name' in data && 'weight' in data);
  }

  private readonly logger = new Logger(PokeapiService.name);

  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  private buildPokeApiEndpoint(metadata: Record<string, any>): string {
    if (metadata.name) {
      return `pokemon/${metadata.name}`;
    }
    const keys = Object.keys(metadata);
    if (keys.length > 0) {
      const key = keys[0];
      return `${key}/${metadata[key]}`;
    }
    throw new Error('No endpoint or parameter provided for PokeAPI');
  }

  async getPokemon(metadata: Record<string, any>) {
    const endpoint = this.buildPokeApiEndpoint(metadata);
    const cacheKey = `pokeapi:${endpoint}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      this.logger.log(`Cache hit for ${cacheKey}`);
      return JSON.parse(cached);
    }
    try {
      const url = `${process.env.POKEAPI_BASE_URL}/${endpoint}`;
      this.logger.log(`Requesting Pokemon API endpoint: ${url}`);
      const response = await axios.get(url);
      const data = response.data;

      if (this.isPokeApiPokemon(data)) {
        const pokemonData = data;
        const result = {
          name: pokemonData.name,
          weight: pokemonData.weight,
          powers: pokemonData.types.map((t: any) => t.type.name),
        };
        await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 3600);
        return result;
      }
      await this.redis.set(cacheKey, JSON.stringify(data), 'EX', 3600);
      return data;
    } catch (error) {
      this.logger.error('Error fetching Pokemon data', error);
      throw error;
    }
  }
}
