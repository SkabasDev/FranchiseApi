import { Injectable } from '@nestjs/common';
import { FranchiseStrategy } from '../domain/franchise-strategy.interface';
import { PokeapiService } from '../../infrastructure/services/pokeapi.service';

@Injectable()
export class PokemonStrategy implements FranchiseStrategy {
  constructor(private readonly pokeapi: PokeapiService) {}

  async getData(metadata: any): Promise<any> {
    return this.pokeapi.getPokemon(metadata);
  }
}
