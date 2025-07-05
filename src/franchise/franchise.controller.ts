import { Controller, Get, Query, Param, BadRequestException } from '@nestjs/common';
import { FranchiseService } from './franchise.service';

@Controller('/api/:franchise/:version')
export class FranchiseController {
  constructor(private readonly franchiseService: FranchiseService) {}

  @Get()
  async getFranchiseData(
    @Param('franchise') franchise: string,
    @Param('version') version: string,
    @Query('metadata') metadataRaw: string,
    @Query('config') configRaw: string,
  ) {
    let metadata: any;
    let config: any;
    try {
      metadata = metadataRaw ? JSON.parse(metadataRaw) : {};
      config = configRaw ? JSON.parse(configRaw) : {};
    } catch {
      throw new BadRequestException('Invalid JSON in metadata or config');
    }
    return this.franchiseService.getFranchiseData(franchise, version, metadata, config);
  }
}