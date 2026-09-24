import { FacebookAuthenticationService } from '@/data/services'
import { makeFacebookApi } from '@/main/factories/apis'
import { makePgUserAcccountRepository } from '@/main/factories/repositories'
import { makeJwtTokenGenerator } from '../crypto'

export function makeFacebookAuthenticationService (): FacebookAuthenticationService {
  return new FacebookAuthenticationService(
    makeFacebookApi(),
    makePgUserAcccountRepository(),
    makeJwtTokenGenerator()
  )
}