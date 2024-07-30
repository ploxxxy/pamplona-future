import { PrismaClient } from '@prisma/client'
import progressionFlags from './resources/progressionFlags.json'

export async function seed(prisma: PrismaClient) {
  await prisma.progressionFlag.createMany({
    data: progressionFlags,
    skipDuplicates: true,
  })
}
