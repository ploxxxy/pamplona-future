import { PrismaClient } from '@prisma/client'
import { main as customization } from './customization'
import { main as progression } from './progression'

const prisma = new PrismaClient()

async function main() {
  await customization(prisma)
  await progression(prisma)

  await prisma.user.create({
    data: {
      name: 'ploxxxxxxy',
      personaId: '1011786733',
      division: 'Gold',
      divisionRank: 1,
      tagData: {
        create: {
          frame: '2573550572',
          bg: '232356850',
          detail: '3420869487',
        },
      },
      // itemUnlocks: {
      //   createMany: {
      //     data: items.map((reward) => ({
      //       itemId: reward.id,
      //     })),
      //   },
      // },
      // kitUnlocks: {
      //   createMany: {
      //     data: kits.map((kit) => ({
      //       kitId: kit.id.toLowerCase(),
      //       opened: kit.opened,
      //     })),
      //   },
      // },
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
