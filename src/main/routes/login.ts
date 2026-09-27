import { adaptExpressRoute } from '@/main/adapters'
import { Router } from 'express'
import { makeFacebookLoginController } from '../factories/controllers'

export function loginRoutes (router: Router): void {
  router.post('/login/facebook', adaptExpressRoute(makeFacebookLoginController()))
}

