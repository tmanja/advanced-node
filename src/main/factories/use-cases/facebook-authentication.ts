import { FacebookAuthenticationUseCase } from '@/domain/use-cases'
import { makeFacebookApi } from '@/main/factories/apis'
import { makePgUserAcccountRepository } from '@/main/factories/repositories'
import { makeJwtTokenGenerator } from '../crypto'

export function makeFacebookAuthentication (): FacebookAuthenticationUseCase {
  return new FacebookAuthenticationUseCase(
    makeFacebookApi(),
    makePgUserAcccountRepository(),
    makeJwtTokenGenerator()
  )
}