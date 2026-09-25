import request from 'supertest'
import { app } from '@/main/config/app'
import { PgUser } from '@/infra/postgres/entities'
import { makeFakeDb } from '@/tests/infra/postgres/mocks'
import { IBackup } from 'pg-mem'
import {  getConnection } from 'typeorm'
import { FacebookApi } from '@/infra/apis'
import { UnauthorizedError } from '@/application/errors'

describe('Login Routes', () => {
  describe('POST /login/facebook', () => {
    let backup: IBackup

    beforeAll(async () => {
        const db = await makeFakeDb([PgUser])
        backup = db.backup()
        jest.spyOn(FacebookApi.prototype, 'loadUser').mockResolvedValue({
          name: 'any_name',
          email: 'any_email@mail.com',
          facebookId: 'any_facebook_id'
        })
      })

    beforeEach(() => {
      backup.restore()
    })

    afterAll(async () => {
      await getConnection().close()
    })

    it('should return 200 with AccessToken', async () => {
      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'valid_token' })

      expect(status).toBe(200)
      expect(body.accessToken).toBeDefined()
    })

    it('should return 401 with UnauthorizedError', async () => {
      jest.spyOn(FacebookApi.prototype, 'loadUser').mockResolvedValueOnce(null)

      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'valid_token' })

      expect(status).toBe(401)
      expect(body).toEqual({ error: new UnauthorizedError().message })
    })
  })
})