import { FacebookLoginController } from '@/application/controllers'
import { makeFacebookAuthenticationService } from '@/main/factories/services'

export function makeFacebookLoginController (): FacebookLoginController {
  return new FacebookLoginController(makeFacebookAuthenticationService())
}