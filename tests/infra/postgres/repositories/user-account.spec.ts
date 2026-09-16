import { LoadUserAccountRepository } from '@/data/contacts/repositories/user-account'
import { IBackup, newDb } from 'pg-mem'
import { Column, Entity, PrimaryGeneratedColumn, Repository, getConnection, getRepository } from 'typeorm'

class PgUserAccountRepository implements LoadUserAccountRepository {
  async load (params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepository = getRepository(PgUser)
    const pgUser = await pgUserRepository.findOne({ email: params.email })
    if (pgUser !== undefined) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined
      }
    }
  }
}

@Entity({ name: 'usuarios' })
class PgUser {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ name: 'nome', nullable: true })
    name?: string

    @Column()
    email!: string

    @Column({ name: 'id_facebook', nullable: true })
    facebookId!: string
}

describe('PgUserAccountRepository', () => {
  describe('load', () => {
    let sut: PgUserAccountRepository
    let pgUserRepository: Repository<PgUser>
    let backup: IBackup

    beforeAll(async () => {
      const db = newDb();
      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PgUser]
      })
      await connection.synchronize();
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