import { getUserFromSession } from '../..'
import db from '../../../common/prisma'

export default {
  name: 'PamplonaAuthenticated.finishRunnersRoute',
  execute: async (
    params: {
      challengeId: string
      mainStat: number
      runId: number
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

    const mainStat = await db.challengeStat.findFirst({
      where: {
        code: params.challengeId,
      },
    })

    if (!mainStat) {
      throw new Error('Challenge not found')
    }

    await db.challengeEntry.upsert(
      newRecord(personaId, mainStat.challengeId, mainStat.code, params.mainStat)
    )

    const extraStats = Object.keys(params.extraStats)
    // don't await secondary stats
    db.challengeStat
      .findMany({
        where: {
          code: {
            in: extraStats,
          },
        },
      })
      .then((challengeExtraStats) => {
        db.$transaction(
          challengeExtraStats.map((challengeExtraStat) => {
            return db.challengeEntry.upsert(
              newRecord(
                personaId,
                challengeExtraStat.challengeId,
                challengeExtraStat.code,
                params.extraStats[challengeExtraStat.code]
              )
            )
          })
        )
      })

    return 'success'
  },
}

function newRecord(
  personaId: string,
  challengeId: string,
  challengeCode: string,
  newRecord: number
) {
  return {
    where: {
      challengeStatId_userId: {
        challengeStatId: challengeCode,
        userId: personaId,
      },
    },
    create: {
      value: newRecord,
      challengeStatId: challengeCode,
      challengeId: challengeId,
      userId: personaId,
    },
    update: {
      value: newRecord,
    },
  }
}
