import { getUserFromSession } from '../..'
import db from '../../../common/prisma'

export default {
  name: 'PamplonaAuthenticated.openKit',
  execute: async (params: { id: string }, session: string) => {
    const personaId = getUserFromSession(session)

    if (!personaId) {
      throw new Error('Invalid session')
    }
    
    const kitId = params.id.toLowerCase()

    const result = await db.kitUnlock.upsert({
      where: {
        kitId_userId: {
          kitId,
          userId: personaId,
        },
      },
      create: {
        kitId,
        userId: personaId,
        opened: true,
      },
      update: {
        opened: true,
      },
      include: {
        kit: {
          include: {
            rewards: true,
          },
        },
      },
    })

    return result.kit.rewards.map((reward) => ({
      id: reward.id,
      count: 1,
    }))
  },
}
