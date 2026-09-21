import { FacebookApi } from '@/infra/apis'
import { AxiosHttpClient } from '@/infra/http'
import { env } from '@/main/config/env'

describe('Facebook Api Integrations Tests', () => {
  it('should return a Facebook User if token is valid', async () => {
    const axiosClient = new AxiosHttpClient()
    const sut = new FacebookApi(
      axiosClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret
    )

    const facebookUser = await sut.loadUser({ accessToken: 'EAAZAoQp5bDwABStkwrsy7BO7GaKZANC4kqYXAmmawCpYfiSVT3v3pWVO0pubgZBXuCJypr3zt7DIRgVrhUtM9BKSojczCRnmxGZA6paxxZCAs5opF5hCklDduyiYDcdEDolD0O7tujZAHVIbUc3Mf0cxnrW5KCqaTqAYlIjKk5IkuPcJSVzDZB6H6QZCeZAh30SF7EWoYnK7WJhYZBYZBFxIRlAF16OsA1hJoHt7pVnPKZCZAJ2Js09ZBuEZC7vfP9Lw6ulMZAk5a9arm4NZB59U4OazVCLGLVUAPuZBSww9gaDJFWVcvZAucZCOMDzwaAq0L59v237O9UgBrnHxv7gJjNZB0EwZDZD' })

    expect(facebookUser).toEqual({
      facebookId: '2620571661719566',
      name: 'Carlos Alberto',
      email: 'manjaterra.cal@gmail.com'
    })
  })

  it('should return undefined if toke is invalid', async () => {
    const axiosClient = new AxiosHttpClient()
    const sut = new FacebookApi(
      axiosClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret
    )

    const facebookUser = await sut.loadUser({ accessToken: 'invalid_token' })

    expect(facebookUser).toBeNull()
  })
})