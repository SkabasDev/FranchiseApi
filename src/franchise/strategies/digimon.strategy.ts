import { Injectable } from '@nestjs/common';
import { FranchiseStrategy } from '../domain/franchise-strategy.interface';
import { DigiapiService } from '../../infrastructure/services/digiapi.service';

@Injectable()
export class DigimonStrategy implements FranchiseStrategy {
  constructor(private readonly digiapi: DigiapiService) {}

  async getData(metadata: any, config: any): Promise<any> {
    let endpoint = metadata.endpoint;
    if (!endpoint && metadata.name) {
      endpoint = `digimon/${metadata.name}`;
    }
    if (!endpoint) throw new Error('No endpoint or name provided for Digimon');
    return this.digiapi.getDigimon(endpoint, config?.baseUrl);
  }
}
