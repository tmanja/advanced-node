import { PgUserAccountRepository } from '@/infra/postgres/repositories'


export function makePgUserAcccountRepository (): PgUserAccountRepository {
  return new PgUserAccountRepository()
}