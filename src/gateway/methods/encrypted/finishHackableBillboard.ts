import { getUserFromSession } from '../..'
import db from '../../../common/prisma'

export default {
  name: 'PamplonaAuthenticated.finishHackableBillboard',
  execute: async (
    params: {
      challengeId: string
      mainStat: number
      extraStats: Record<string, number>
    },
    sessionId: string
  ) => {
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

    const challengeStat = await db.challengeStat.findFirst({
      where: {
        code: params.challengeId,
      },
    })

    if (!challengeStat) {
      throw new Error('Challenge not found')
    }

    await db.challengeEntry.upsert({
      where: {
        challengeStatId_userId: {
          challengeStatId: params.challengeId,
          userId: personaId,
        },
      },
      create: {
        value: params.mainStat,
        challengeStatId: params.challengeId,
        challengeId: challengeStat.challengeId,
        userId: personaId,
      },
      update: {
        value: params.mainStat,
      },
    })

    return 'success'
  },
}
