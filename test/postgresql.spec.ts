import { createConnection, getConnection } from 'typeorm';
describe('PostgreSQL connection', () => {
  beforeAll(async () => {
    await createConnection({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [],
      synchronize: false,
    });
  });
  afterAll(async () => {
    await getConnection().close();
  });
  it('should connect to the database', async () => {
    const conn = getConnection();
    expect(conn.isConnected).toBe(true);
  });
});
