import { ConnectionOptions } from 'typeorm';

export const config: ConnectionOptions = {
  type: 'postgres',
  host: 'db.sxtflckkzwlrczkswspa.supabase.co',
  port: 5432,
  username: 'postgres',
  database: 'postgres',
  password: '92Scy3wL#avegy3',
  entities: ['dist/infra/postgres/entities/index.js']
}