import { PokeapiService } from '../src/infrastructure/services/pokeapi.service';
import Redis from 'ioredis';

jest.mock('ioredis');

describe('PokeapiService', () => {
  let service: PokeapiService;
  let redisMock: any;

  beforeEach(() => {
    redisMock = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue('OK'),
    };
    service = new PokeapiService(redisMock as unknown as Redis);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch and map Ditto correctly from PokeAPI', async () => {
    const result = await service.getPokemon({ name: 'ditto' });
    expect(result).toBeDefined();
    expect(result.name).toBe('ditto');
    expect(result.weight).toBe(40);
    expect(Array.isArray(result.powers)).toBe(true);
    expect(result.powers).toContain('normal');
  });
});
