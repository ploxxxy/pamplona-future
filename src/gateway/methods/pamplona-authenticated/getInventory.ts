import { getUserFromSession } from '../..'
import db from '../../../common/prisma'

export default {
  name: 'PamplonaAuthenticated.getInventory',
  execute: async (params: {}, sessionId: string) => {
    const personaId = getUserFromSession(sessionId)

    if (!personaId) {
      throw new Error('Invalid session')
    }

    const user = await db.user.findFirst({
      where: {
        personaId,
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    return await getInventoryFromDb(personaId)
  },
}

// TODO: remove ?
export const getInventoryFromDb = async (personaId: string) => {
  const kits = await db.kitUnlock.findMany({
    where: {
      userId: personaId,
    },
    select: {
      kitId: true,
      opened: true,
      kit: {
        select: { kitType: true },
      },
    },
  })

  const items = await db.itemUnlock.findMany({
    where: {
      userId: personaId,
    },
    select: {
      itemId: true,
    },
  })

  return {
    kits: kits.map((kit) => ({
      id: kit.kitId,
      kitType: kit.kit.kitType,
      opened: kit.opened,
    })),
    items: items.map((item) => ({
      id: item.itemId,
      count: 1,
    })),
  }
}
