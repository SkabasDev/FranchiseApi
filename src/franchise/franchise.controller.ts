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
    let metadataError: string | null = null;
    try {
      metadata = metadataRaw ? JSON.parse(metadataRaw) : {};
      config = configRaw ? JSON.parse(configRaw) : {};
    } catch (err) {
      metadataError = err?.message || 'Error in metadata';
    }
    if (metadataError) {
      await this.franchiseService.getFranchiseData(franchise, version, metadataRaw, config, metadataError);
      return { message: metadataError };
    }
    return this.franchiseService.getFranchiseData(franchise, version, metadata, config);
  }
}