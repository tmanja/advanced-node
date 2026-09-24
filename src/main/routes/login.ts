import { Router } from 'express'

export function loginRoutes (router: Router): void {
  router.post('/login/facebook', (req, res) => {
    res.send({ data: 'any_data' })
  })
}

