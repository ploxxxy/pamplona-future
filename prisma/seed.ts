import { PrismaClient } from '@prisma/client'
import { main as customization } from './customization'
import { main as progression } from './progression'

const prisma = new PrismaClient()

async function main() {
  const intialRewards = await customization(prisma)
  await progression(prisma)

  await prisma.user.create({
    data: {
      name: 'ploxxy',
      personaId: '1011786733',
      division: 'Gold',
      divisionRank: 1,
      tagData: {
        create: {
          frame: '742845892',
          bg: '1310589350',
          detail: '1640298601',
        },
      },
      itemUnlocks: {
        createMany: {
          data: intialRewards.map((reward) => ({
            itemId: reward.id,
            count: 1,
          })),
        },
      },
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
  })
