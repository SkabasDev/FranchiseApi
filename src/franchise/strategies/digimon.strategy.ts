import { Injectable } from '@nestjs/common';
import { FranchiseStrategy } from '../domain/franchise-strategy.interface';
import { DigiapiService } from '../../infrastructure/services/digiapi.service';

@Injectable()
export class DigimonStrategy implements FranchiseStrategy {
  constructor(private readonly digiapi: DigiapiService) {}

  async getData(metadata: any): Promise<any> {
    return this.digiapi.getDigimon(metadata);
  }
}
