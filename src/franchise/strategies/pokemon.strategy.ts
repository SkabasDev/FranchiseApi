import { Injectable } from '@nestjs/common';
import { FranchiseStrategy } from '../domain/franchise-strategy.interface';
import { PokeapiService } from '../../infrastructure/services/pokeapi.service';

@Injectable()
export class PokemonStrategy implements FranchiseStrategy {
  constructor(private readonly pokeapi: PokeapiService) {}

  async getData(metadata: any, config: any): Promise<any> {
    let endpoint = metadata.endpoint;
    if (!endpoint && metadata.name) {
      endpoint = `pokemon/${metadata.name}`;
    }
    if (!endpoint) throw new Error('No endpoint or name provided for Pokémon');
    return this.pokeapi.getPokemon(endpoint, config?.baseUrl);
  }
}
