import { LoadUserAccount, SaveFacebokAccountRepository, SaveFacebookAccount } from '@/domain/contracts/repositories'
import { getRepository } from 'typeorm'
import { PgUser } from '../entities'

type LoadParams = LoadUserAccount.Input
type LoadResult = LoadUserAccount.Output
type SaveParams = SaveFacebokAccountRepository.Input
type SaveResult = SaveFacebokAccountRepository.Output

export class PgUserAccountRepository implements LoadUserAccount, SaveFacebookAccount {

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
      await pgUserRepository.update({ id: parseInt(id) }, {
        name,
        email,
        facebookId
      })
    }
    return { id: resultId }
  }
}