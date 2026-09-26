import { PgUser } from '@/infra/postgres/entities'
import { PgUserAccountRepository } from '@/infra/postgres/repositories';
import { makeFakeDb } from '@/tests/infra/postgres/mocks';
import { Repository, getConnection, getRepository } from 'typeorm'
import { IBackup } from 'pg-mem'

describe('PgUserAccountRepository', () => {
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

  describe('load', () => {
    it('should return an account if email exists', async () => {
      await pgUserRepository.save({ email: 'existing_email@mail.com' })

      const userAccount = await sut.load({ email: 'existing_email@mail.com' })

      expect(userAccount).toEqual({
        id: '1'
      })
    })

    it('should return undefined if email does not exists', async () => {
      const userAccount = await sut.load({ email: 'not_existing_email@mail.com' })

      expect(userAccount).toBeUndefined()
    })
  })

  describe('saveWithFacebook', () => {
    it('should create a user account if id is undefined', async () => {
      const { id } = await sut.saveWithFacebook({
        name: 'any_facebook_name',
        email: 'any_facebook_email@mail.com',
        facebookId: 'any_facebook_id'
      })
      const pgUser = await pgUserRepository.findOne({ email: 'any_facebook_email@mail.com' })

      expect(pgUser).toEqual({
        id: 1,
        name: 'any_facebook_name',
        email: 'any_facebook_email@mail.com',
        facebookId: 'any_facebook_id'
      })
      expect(id).toBe('1')
    })

    it('should update if id is defined', async () => {
      await pgUserRepository.save({
        name: 'any_name',
        email: 'any_email@mail.com',
        facebookId: 'any_facebook_id'
      })

      const { id } = await sut.saveWithFacebook({
        id: '1',
        name: 'any_name',
        email: 'new_email@mail.com',
        facebookId: 'new_facebook_id'
      })
      const pgUser = await pgUserRepository.findOne({ id: 1 })

      expect(pgUser).toEqual({
        id: 1,
        name: 'any_name',
        email: 'new_email@mail.com',
        facebookId: 'new_facebook_id'
      })
      expect(id).toBe('1')
    })
  })
})