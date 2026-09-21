import { FacebookApi } from '@/infra/apis'
import { AxiosHttpClient } from '@/infra/http'
import { env } from '@/main/config/env'

describe('Facebook Api Integrations Tests', () => {
  let axiosClient: AxiosHttpClient
  let sut: FacebookApi
  const accessToken =
  'EAAZAoQp5bDwABSnTgU5w0ko4ffJ67wZAB2j6T3TTJvZAaZBZCZBhpD0FZCRCHTkcYHD7WQY0YNreVyA7xpsj1N4LsIsSFRw47605wzNhsYC4E4BSj123G6dagI6drT9cDPIwGhNAEBHUISjaPxvLoetoZAaqhq9f5ipsKQ5O5r27hRSwVwgxYUIcdtSrcv2t6iq7tyq1reHMNRmoHXzkQf6WDZBcCMBHM2t6vDZAQzpET7UZCaxTQhvZC4AlZAzavecX510BKwTBgMA34X5AWDUr3hGCbQphdXybPyvts2s6ETBQqQnyQJjwoJKPvczK23NChnN3GXT9WZADbvSZBbx'

  beforeEach(() => {
    axiosClient = new AxiosHttpClient()
    sut = new FacebookApi(
      axiosClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret
    )
  })

  it('should return a Facebook User if token is valid', async () => {
    const facebookUser = await sut.loadUser({ accessToken })

    expect(facebookUser).toEqual({
      facebookId: '2620571661719566',
      name: 'Carlos Alberto',
      email: 'manjaterra.cal@gmail.com'
    })
  })

  it('should return undefined if toke is invalid', async () => {
    const facebookUser = await sut.loadUser({ accessToken: 'invalid_token' })

    expect(facebookUser).toBeNull()
  })
})