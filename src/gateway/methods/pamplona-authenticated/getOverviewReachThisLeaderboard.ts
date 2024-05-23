import { Division, UgcEntry } from '@prisma/client'
import { getUserFromSession } from '../../'
import db from '../../../common/prisma'

export default {
  name: 'PamplonaAuthenticated.getOverviewReachThisLeaderboard',
  execute: async (
    params: { ugcId: { id: string; userId: number }; radius: number | null },
    session: string
  ) => {
    const personaId = getUserFromSession(session)

    if (!personaId) {
      throw new Error('Invalid session')
    }

    const qty = params.radius || 5

    // TODO: query for entries NEAR user's entry
    const entries = await db.ugcEntry.findMany({
      where: {
        ugc: {
          reachThis: {
            id: params.ugcId.id,
          },
        },
      },
      orderBy: {
        score: 'desc',
      },
      include: {
        user: {
          select: {
            division: true,
            divisionRank: true,
            name: true,
            personaId: true,
          },
        },
      },
      take: qty,
    })

    const totalCount = await db.ugcEntry.count({
      where: {
        ugc: {
          reachThis: {
            id: params.ugcId.id,
          },
        },
      },
    })

    // const userEntry = await db.ugcEntry.findFirst({
    //   where: {
    //     ugcId: params.ugcId.id,
    //     userId: personaId,
    //   },
    // })

    // const leaderEntry = await db.ugcEntry.findFirst({
    //   where: {
    //     ugc: {
    //       reachThis: {
    //         id: params.ugcId.id,
    //       }
    //     }
    //   },
    //   orderBy: {
    //     score: 'desc',
    //   },
    //   include: {
    //     user: {
    //       select: {
    //         division: true,
    //         divisionRank: true,
    //         name: true,
    //         personaId: true,
    //       },
    //     },
    //   },
    //   take: 1,
    // })

    if (!entries.length) {
      return {
        leaderboard: {
          area: null,
          totalCount: 0,
          users: [],
        },
        globalLeader: null,
      }
    }

    return {
      leaderboard: {
        area: null,
        totalCount,
        users: entries.map(mapEntry),
      },
      globalLeader: mapEntry(entries[0], 0),
    }
  },
}

const mapEntry = (
  entry: UgcEntry & {
    user: {
      personaId: string
      name: string
      division: Division
      divisionRank: number
    }
  },
  index: number
) => ({
  position: index + 1,
  globalRank: index + 1,
  score: entry.score,
  percentile: null,
  personaId: entry.userId,
  name: entry.user.name,
  division: {
    name: entry.user.division,
    rank: entry.user.divisionRank,
  },
})
