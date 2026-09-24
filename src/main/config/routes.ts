import { Express, Router } from 'express'
import { loginRoutes } from '../routes/login'

export function setupRoutes (app: Express): void {
  const router = Router()
  app.use('/api', router)
  loginRoutes(router)
}