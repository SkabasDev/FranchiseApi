import { Injectable, Logger, Inject } from '@nestjs/common';
import axios from 'axios';
import { PokeApiSpeciesResponse, PokeApiEvoChainResponse, PokeApiResponse } from '~/interfaces/external/pokeapi-response.interface';
import Redis from 'ioredis';

@Injectable()
export class PokeapiService {
  private readonly logger = new Logger(PokeapiService.name);

  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  async getPokemon(endpoint: string, baseUrl?: string) {
    const cacheKey = `pokeapi:${endpoint}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      this.logger.log(`Cache hit for ${cacheKey}`);
      return JSON.parse(cached);
    }
    try {
      const url = `${baseUrl || 'https://pokeapi.co/api/v2'}/${endpoint}`;
      this.logger.log(`Requesting Pokemon API endpoint: ${url}`);
      const response = await axios.get(url);
      // Si el endpoint es 'pokemon/<name>' se puede obtener evoluciones
      if (endpoint.startsWith('pokemon/')) {
        const pokemonData = response.data as PokeApiResponse;
        // Obtener evoluciones
        let evolutions: string[] = [];
        try {
          const speciesUrl = pokemonData.species.url;
          const speciesRes = await axios.get(speciesUrl);
          const speciesData = speciesRes.data as PokeApiSpeciesResponse;
          const evoChainUrl = speciesData.evolution_chain.url;
          const evoChainRes = await axios.get(evoChainUrl);
          const evoChainData = evoChainRes.data as PokeApiEvoChainResponse;
          let evo = evoChainData.chain;
          while (evo) {
            evolutions.push(evo.species.name);
            evo = evo.evolves_to && evo.evolves_to[0];
          }
        } catch (e) {
          this.logger.warn('Could not fetch evolutions', e);
          evolutions = [];
        }
        const result = {
          name: pokemonData.name,
          weight: pokemonData.weight,
          powers: pokemonData.types.map((t: any) => t.type.name),
          evolutions
        };
        await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 3600);
        return result;
      }
      // Para otros endpoints, retorna el resultado crudo
      await this.redis.set(cacheKey, JSON.stringify(response.data), 'EX', 3600);
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching Pokemon data', error);
      throw error;
    }
  }
}
