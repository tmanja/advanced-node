import { UserProfile } from '@/domain/entities'

describe('UserProfile', () => {
  let sut: UserProfile

  beforeEach(() => {
    sut = new UserProfile('any_user_id')
  })

  it('should create with empty initials when pictureUrl is provided', () => {
    sut.setPicture({ pictureUrl: 'any_picture_url', name: 'any_name' })

    expect(sut).toEqual({
      id: 'any_user_id',
      pictureUrl: 'any_picture_url',
      initials: undefined
    })
  })

  it('should create with empty initials when pictureUrl is provided', () => {
    sut.setPicture({ pictureUrl: 'any_picture_url' })

    expect(sut).toEqual({
      id: 'any_user_id',
      pictureUrl: 'any_picture_url',
      initials: undefined
    })
  })

  it('should create initials with first two letters of first name', () => {
    sut.setPicture({ name: 'eliana' })

    expect(sut).toEqual({
      id: 'any_user_id',
      pictureUrl: undefined,
      initials: 'EL'
    })
  })

  it('should create initials with first letter of first and last names', () => {
    sut.setPicture({ name: 'eliana da silva manjaterrra' })

    expect(sut).toEqual({
      id: 'any_user_id',
      pictureUrl: undefined,
      initials: 'EM'
    })
  })

  it('should create initials with first letter', () => {
    sut.setPicture({ name: 'e' })

    expect(sut).toEqual({
      id: 'any_user_id',
      pictureUrl: undefined,
      initials: 'E'
    })
  })

  it('should create with empty initials when name and pictureUrl are not provided', () => {
    sut.setPicture({})

    expect(sut).toEqual({
      id: 'any_user_id',
      pictureUrl: undefined,
      initials: undefined
    })
  })

})