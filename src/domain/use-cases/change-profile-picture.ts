import { UploadFile, UUIDGenerator } from '@/domain/contracts/gateways'
import { LoadUserProfile, SaveUserPicture } from '@/domain/contracts/repositories'

type Setup = (fileStorage: UploadFile, crypto: UUIDGenerator, userProfileRepository: SaveUserPicture & LoadUserProfile) => ChangeProfilePicture
type Input = { userId: string, file?: Buffer }
export type ChangeProfilePicture = (input: Input) => Promise<void>

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepository) =>
  async({ userId, file }) => {
  let pictureUrl: string | undefined
  if (file !== undefined) {
    pictureUrl = await fileStorage.upload({ file, key: crypto.uuid({ key: userId }) })
  } else {
    await userProfileRepository.load({ id: userId })
  }
  await userProfileRepository.savePicture({ pictureUrl })
}