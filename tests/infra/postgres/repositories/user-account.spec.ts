import { LoadUserAccountRepository } from '@/data/contacts/repositories/user-account'
import { newDb } from 'pg-mem'
import { Column, Entity, PrimaryGeneratedColumn, getRepository } from 'typeorm'

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
    it('should return an account if email exists', async () => {
      const db = newDb();
      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PgUser]
      })

      await connection.synchronize();
      const pgUserRepository = getRepository(PgUser)
      await pgUserRepository.save({ email: 'existing_email@mail.com' })

      const sut = new PgUserAccountRepository()

      const userAccount = await sut.load({ email: 'existing_email@mail.com' })

      expect(userAccount).toEqual({ id: '1' })
    })
  })
})