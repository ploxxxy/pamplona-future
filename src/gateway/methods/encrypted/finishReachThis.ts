import { getUserFromSession } from '../..'
import db from '../../../common/prisma'

export default {
  name: 'PamplonaAuthenticated.finishReachThis',
  execute: async (
    params: { ugcId: { id: string; userId: number } },
    session: string
  ) => {
    const personaId = getUserFromSession(session)

    if (!personaId) {
      throw new Error('Invalid session')
    }

    const timestamp = Date.now().toString()

    const ugc = await db.ugc.findFirst({
      where: {
        reachThis: {
          id: params.ugcId.id,
        },
      },
    })

    if (!ugc) {
      throw new Error('UGC not found')
    }

    await db.ugcEntry.upsert({
      where: {
        ugcId_userId: {
          ugcId: ugc.id,
          userId: personaId,
        },
      },
      create: {
        ugcId: ugc.id,
        userId: personaId,
        score: timestamp,
        finishedAt: timestamp,
      },
      update: {
        score: timestamp,
        finishedAt: timestamp,
      },
    })

    // TODO: use extractUGCData ?

    return {
      meta: null,
      stats: null,
      userStats: { reachedAt: timestamp },
      userRank: { rank: 1, score: timestamp, total: 1 },
    }
  },
}
