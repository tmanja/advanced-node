import { JwtTokenHandler } from '@/infra/crypto'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

describe('JwtTokenGenerator', () => {
  let sut: JwtTokenHandler
  let fakeJwt: jest.Mocked<typeof jwt>
  let secret: string
  let expirationInMs: number

  beforeAll(() => {
    secret = 'any_secret'
    expirationInMs = 1000
    fakeJwt = jwt as jest.Mocked<typeof jwt>
  })

  beforeEach(() => {
    sut = new JwtTokenHandler(secret)
  })

  describe('generateToken', () => {
    let key: string
    let token: string

    beforeAll(() => {
      key = 'any_key'
      token = 'any_token'
      fakeJwt.sign.mockImplementation(() => token)
    })

    it('should call sign with correct params', () => {
      sut.generateToken({ key, expirationInMs})

      expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secret, { expiresIn: 1})
      expect(fakeJwt.sign).toHaveBeenCalledTimes(1)
    })

    it('should return a token', () => {
      const generedToken = sut.generateToken({ key, expirationInMs})

      expect(generedToken).toEqual(token)
    })

    it('should rethrow if sign throws', () => {
      fakeJwt.sign.mockImplementationOnce(() => {
        throw new Error('token_error')
      })

      expect(() => sut.generateToken({ key, expirationInMs })).toThrow(new Error('token_error'))
    })
  })

  describe('validateToken', () => {
    let token: string
    let fakeKey: string

    beforeAll(() => {
      fakeKey = 'any_key'
      token = 'any_token'
      fakeJwt.verify.mockImplementation(() => ({ key: fakeKey }))
    })

    it('should call verify with correct params', () => {
      sut.validateToken({ token })

      expect(fakeJwt.verify).toHaveBeenCalledWith(token, secret)
      expect(fakeJwt.verify).toHaveBeenCalledTimes(1)
    })

    it('should return key used to sign', () => {
      const key = sut.validateToken({ token })

      expect(key).toBe(fakeKey)
    })
  })
})