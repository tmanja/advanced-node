import { LoadUserAccountRepository, SaveFacebokAccountRepository, SaveFacebookAccountRepository } from '@/data/contacts/repositories'
import { getRepository } from 'typeorm'
import { PgUser } from '../entities'

export class PgUserAccountRepository implements LoadUserAccountRepository {
  async load (params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepository = getRepository(PgUser)
    const pgUser = await pgUserRepository.findOne({ email: params.email })
    if (pgUser !== undefined) {
      return {
        id: pgUser.id.toString(),
        ...(pgUser.name != null && { name: pgUser.name })
      }
    }
  }

  async saveWithFacebook (params: SaveFacebokAccountRepository.Params): Promise<void> {
    const pgUserRepository = getRepository(PgUser)
    await pgUserRepository.save({
      name: params.name,
      email: params.email,
      facebookId: params.facebookId
    })
  }
}