import { DigiapiService } from '../src/infrastructure/services/digiapi.service';
import Redis from 'ioredis';

jest.mock('ioredis');

describe('DigiapiService', () => {
  let service: DigiapiService;
  let redisMock: any;

  beforeEach(() => {
    redisMock = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue('OK'),
    };
    service = new DigiapiService(redisMock as unknown as Redis);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch and map Agumon correctly from DigiAPI', async () => {
    const result = await service.getDigimon({ name: 'Agumon' });
    expect(result).toBeDefined();
    expect(result.name).toBe('Agumon');
    expect(Array.isArray(result.powers)).toBe(true);
    // Puedes agregar más asserts según tu mapping
  });
});
