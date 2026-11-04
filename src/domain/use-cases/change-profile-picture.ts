import { UploadFile, UUIDGenerator } from '@/domain/contracts/gateways'
import { LoadUserProfile, SaveUserPicture } from '@/domain/contracts/repositories'
import { UserProfile } from '../entities'

type Setup = (fileStorage: UploadFile, crypto: UUIDGenerator, userProfileRepository: SaveUserPicture & LoadUserProfile) => ChangeProfilePicture
type Input = { userId: string, file?: Buffer }
type Output = { pictureUrl?: string, initials?: string }
export type ChangeProfilePicture = (input: Input) => Promise<Output>

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepository) =>
  async({ userId, file }) => {
  let pictureUrl: string | undefined
  let name: string | undefined
  if (file !== undefined) {
    pictureUrl = await fileStorage.upload({ file, key: crypto.uuid({ key: userId }) })
  } else {
    name = (await userProfileRepository.load({ id: userId })).name
  }
  const userProfile = new UserProfile(userId)
  userProfile.setPicture({ pictureUrl, name })
  await userProfileRepository.savePicture(userProfile)
  return userProfile
}