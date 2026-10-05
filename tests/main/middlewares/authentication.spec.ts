import request from 'supertest'
import { app } from '@/main/config/app'
import { ForbiddenError } from '@/application/errors'
import { auth } from '@/main/middlewares'

describe('Authentication Middleware', () => {
  it('should return 403 if authorization header was not provided', async () => {
    app.get('/fake_route', auth, (req, res) => {
      res.json(req.locals)
    })
    const { status, body } = await request(app)
      .get('/fake_route')
      .send({ token: 'valid_token' })

    expect(status).toBe(403)
    expect(body).toEqual({ error: new ForbiddenError().message })
  })
})