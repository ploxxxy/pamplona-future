import { PrismaClient } from '@prisma/client'
import {
  PamProgressionFlag,
  PamProgressionFlagGroup,
} from './resources/PlayerProgressionData.json'

export async function main(prisma: PrismaClient) {
  const progressionFlags = PamProgressionFlag.filter(
    (flag) => flag.SyncToOnline === 'True'
  ).map((flag) => ({ flag: flag.SyncStatName }))

  const progressionFlagGroups = PamProgressionFlagGroup.filter(
    (flag) => flag.SyncNumberOfFlagsSetToOnline === 'True'
  ).map((flagGroup) => ({
    flag: flagGroup.NumberOfFlagsSyncStatName,
  }))

  const allFlags = [...progressionFlags, ...progressionFlagGroups]

  await prisma.progressionFlag.createMany({
    data: allFlags,
    skipDuplicates: true,
  })
}
