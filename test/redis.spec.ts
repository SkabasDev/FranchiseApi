import Redis from 'ioredis';
describe('Redis connection', () => {
  let redis: Redis;
  beforeAll(() => {
    redis = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    });
  });
  afterAll(() => redis.disconnect());
  it('should set and get a value', async () => {
    await redis.set('test-key', 'test-value');
    const value = await redis.get('test-key');
    expect(value).toBe('test-value');
  });
});
