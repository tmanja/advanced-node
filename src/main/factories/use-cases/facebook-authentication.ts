import { FacebookAuthentication, setupFacebookAuthentication } from '@/domain/use-cases'
import { makeFacebookApi } from '@/main/factories/apis'
import { makePgUserAcccountRepository } from '@/main/factories/repositories'
import { makeJwtTokenHandler } from '../crypto'

export function makeFacebookAuthentication (): FacebookAuthentication {
  return setupFacebookAuthentication(
    makeFacebookApi(),
    makePgUserAcccountRepository(),
    makeJwtTokenHandler()
  )
}