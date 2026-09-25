import { FacebookAccount } from '@/domain/models'

describe('FacebookAccount', () => {
  const facebookAccount = {
    name: 'any_facebook_name',
    email: 'any_facebook_email@mail.com',
    facebookId: 'any_facebook_id'
  }
  it('should create with facebook account only', () => {
    const sut = new FacebookAccount(facebookAccount)
    expect(sut).toEqual(facebookAccount)
  })

  it('should update name when user account has no name', () => {
    const userAccount = { id: 'any_id' }
    const sut = new FacebookAccount(facebookAccount, userAccount)
    expect(sut).toEqual({...facebookAccount, ...userAccount})
  })

  it('should not update name when user account already has a name', () => {
    const userAccount = {
      id: 'any_id',
      name: 'any_name'
    }
    const sut = new FacebookAccount(facebookAccount, userAccount)
    expect(sut).toEqual({...facebookAccount, ...userAccount})
  })
})