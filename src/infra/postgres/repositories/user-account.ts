import { LoadUserAccountRepository, SaveFacebokAccountRepository, SaveFacebookAccountRepository } from '@/data/contacts/repositories'
import { getRepository } from 'typeorm'
import { PgUser } from '../entities'

type LoadParams = LoadUserAccountRepository.Params
type LoadResult = LoadUserAccountRepository.Result
type SaveParams = SaveFacebokAccountRepository.Params
type SaveResult = SaveFacebokAccountRepository.Result

export class PgUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {

  async load ({ email }: LoadParams): Promise<LoadResult> {
    const pgUserRepository = getRepository(PgUser)
    const pgUser = await pgUserRepository.findOne({ email })
    if (pgUser !== undefined) {
      return {
        id: pgUser.id.toString(),
        ...(pgUser.name != null && { name: pgUser.name })
      }
    }
  }

  async saveWithFacebook ({ id, name, email, facebookId }: SaveParams): Promise<SaveResult> {
    const pgUserRepository = getRepository(PgUser)
    let resultId: string
    if (id === undefined) {
      const pgUser = await pgUserRepository.save({
        name,
        email,
        facebookId
      })
      resultId = pgUser.id.toString()
    } else {
      resultId = id
      const pgUser = await pgUserRepository.findOne({ id: parseInt(id) })
      await pgUserRepository.update({ id: parseInt(id) }, {
        name: pgUser?.name ?? name,
        email,
        facebookId
      })
    }
    return { id: resultId }
  }
}