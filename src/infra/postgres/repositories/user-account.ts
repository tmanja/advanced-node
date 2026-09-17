import { LoadUserAccountRepository, SaveFacebokAccountRepository } from '@/data/contacts/repositories'
import { getRepository } from 'typeorm'
import { PgUser } from '../entities'

type LoadParams = LoadUserAccountRepository.Params
type LoadResult = LoadUserAccountRepository.Result
type SaveParams = SaveFacebokAccountRepository.Params
type SaveResult = SaveFacebokAccountRepository.Result

export class PgUserAccountRepository implements LoadUserAccountRepository {
  private readonly pgUserRepository = getRepository(PgUser)

  async load (params: LoadParams): Promise<LoadResult> {
    const pgUser = await this.pgUserRepository.findOne({ email: params.email })
    if (pgUser !== undefined) {
      return {
        id: pgUser.id.toString(),
        ...(pgUser.name != null && { name: pgUser.name })
      }
    }
  }

  async saveWithFacebook (params: SaveParams): Promise<SaveResult> {
    let id: string
    if (params.id === undefined) {
      const pgUser = await this.pgUserRepository.save({
        name: params.name,
        email: params.email,
        facebookId: params.facebookId
      })
      id = pgUser.id.toString()
    } else {
      id = params.id
      const pgUser = await this.pgUserRepository.findOne({ id: parseInt(params.id) })
      await this.pgUserRepository.update({ id: parseInt(params.id) }, {
        name: pgUser!.name ?? params.name,
        email: params.email,
        facebookId: params.facebookId
      })
    }
    return { id }
  }
}