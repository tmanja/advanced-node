import { FacebookLoginController } from '@/application/controllers'
import { makeFacebookAuthentication } from '@/main/factories/use-cases'

export function makeFacebookLoginController (): FacebookLoginController {
  return new FacebookLoginController(makeFacebookAuthentication())
}