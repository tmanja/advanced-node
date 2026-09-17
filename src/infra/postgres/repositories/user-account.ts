import { LoadUserAccountRepository } from '@/data/contacts/repositories'
import { getRepository } from 'typeorm'
import { PgUser } from '../entities'

export class PgUserAccountRepository implements LoadUserAccountRepository {
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