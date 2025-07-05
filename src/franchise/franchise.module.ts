import { Module } from '@nestjs/common';
import { FranchiseService } from './franchise.service';
import { FranchiseController } from './franchise.controller';
import { PokeapiService } from '../infrastructure/services/pokeapi.service';
import { DigiapiService } from '../infrastructure/services/digiapi.service';
import { RequestLog } from '../infrastructure/models/request-log.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PokemonStrategy } from './strategies/pokemon.strategy';
import { DigimonStrategy } from './strategies/digimon.strategy';
import { FranchiseContextService } from './strategies/franchise-context.service';

@Module({
  imports: [TypeOrmModule.forFeature([RequestLog])],
  controllers: [FranchiseController],
  providers: [
    FranchiseService,
    PokeapiService,
    DigiapiService,
    PokemonStrategy,
    DigimonStrategy,
    FranchiseContextService,
  ],
  exports: [FranchiseService],
})
export class FranchiseModule {}
