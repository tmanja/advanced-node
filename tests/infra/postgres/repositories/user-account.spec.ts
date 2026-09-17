import { PgUser } from '@/infra/postgres/entities'
import { PgUserAccountRepository } from '@/infra/postgres/repositories';
import { IBackup, IMemoryDb, newDb } from 'pg-mem'
import { Repository, getConnection, getRepository } from 'typeorm'


async function makeFakeDb (entities?: any[]): Promise<IMemoryDb> {
  const db = newDb();
  const connection = await db.adapters.createTypeormConnection({
    type: 'postgres',
    entities: entities ?? ['src/infra/postgres/entities/index.ts']
  })
  await connection.synchronize();
  return db
}

describe('PgUserAccountRepository', () => {
  describe('load', () => {
    let sut: PgUserAccountRepository
    let pgUserRepository: Repository<PgUser>
    let backup: IBackup

    beforeAll(async () => {
      const db = await makeFakeDb([PgUser])
      backup = db.backup()
      pgUserRepository = getRepository(PgUser)
    })

    beforeEach(() => {
      backup.restore()
      sut = new PgUserAccountRepository()
    })

    afterAll(async () => {
      await getConnection().close()
    })

    it('should return an account if email exists', async () => {
      await pgUserRepository.save({ email: 'existing_email@mail.com' })

      const userAccount = await sut.load({ email: 'existing_email@mail.com' })

      expect(userAccount).toEqual({ id: '1' })
    })

    it('should return undefined if email does not exists', async () => {
      const userAccount = await sut.load({ email: 'not_existing_email@mail.com' })

      expect(userAccount).toBeUndefined()
    })
  })
})