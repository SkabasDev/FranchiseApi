import { Injectable, BadRequestException } from '@nestjs/common';
import { FranchiseStrategy } from '../domain/franchise-strategy.interface';
import { PokemonStrategy } from './pokemon.strategy';
import { DigimonStrategy } from './digimon.strategy';

@Injectable()
export class FranchiseContextService {
  constructor(
    private readonly pokemonStrategy: PokemonStrategy,
    private readonly digimonStrategy: DigimonStrategy,
  ) {}

  getStrategy(franchise: string): FranchiseStrategy {
    switch (franchise.toLowerCase()) {
      case 'pokemon':
        return this.pokemonStrategy;
      case 'digimon':
        return this.digimonStrategy;
      default:
        throw new BadRequestException('Franquicia no soportada');
    }
  }
}
