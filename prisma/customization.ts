import { PrismaClient } from '@prisma/client'
import kitTypes from './resources/kitTypes.json'
import initialRewards from './resources/initialRewards.json'
import runnerKits from './resources/runnerKits.json'

// TODO: add echoes (?)
export async function seed(prisma: PrismaClient) {
  await prisma.kitType.createMany({
    data: kitTypes,
  })

  await prisma.item.createMany({
    data: initialRewards,
  })

  await prisma.$transaction(
    runnerKits.map((kit) => {
      return prisma.kit.create({
        data: {
          id: kit.id,
          name: kit.name,
          kitTypeRelation: {
            connect: { id: kit.kitType },
          },
          rewards: {
            connectOrCreate: kit.rewards.map((reward) => ({
              where: { id: reward.id },
              create: { id: reward.id, name: reward.name },
            })),
          },
        },
      })
    })
  )
}
