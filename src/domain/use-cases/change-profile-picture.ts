import { UploadFile, UUIDGenerator } from '@/domain/contracts/gateways'
import { LoadUserProfile, SaveUserPicture } from '@/domain/contracts/repositories'

type Setup = (fileStorage: UploadFile, crypto: UUIDGenerator, userProfileRepository: SaveUserPicture & LoadUserProfile) => ChangeProfilePicture
type Input = { userId: string, file?: Buffer }
export type ChangeProfilePicture = (input: Input) => Promise<void>

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepository) =>
  async({ userId, file }) => {
  let pictureUrl: string | undefined
  let initials: string | undefined
  if (file !== undefined) {
    pictureUrl = await fileStorage.upload({ file, key: crypto.uuid({ key: userId }) })
  } else {
    const { name } = await userProfileRepository.load({ id: userId })
    const firstLetters = name.match(/\b(.)/g) ?? []
    if (firstLetters?.length > 1) {
      initials = `${firstLetters?.shift()?.toUpperCase() ?? ''}${firstLetters?.pop()?.toUpperCase() ?? ''}`
    } else {
      initials = name.substring(0, 2).toUpperCase()
    }

  }
  await userProfileRepository.savePicture({ pictureUrl, initials })
}