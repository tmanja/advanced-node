import { PgUser } from '@/infra/postgres/entities'
import { PgUserAccountRepository } from '@/infra/postgres/repositories';
import { makeFakeDb } from '@/tests/infra/postgres/mocks';
import { Repository, getConnection, getRepository } from 'typeorm'
import { IBackup } from 'pg-mem'

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