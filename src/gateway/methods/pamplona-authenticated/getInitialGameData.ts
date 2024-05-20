import { getUserFromSession } from '../..'
import db from '../../../common/prisma'

import { extractUGCData } from '../../helper'

export default {
  name: 'PamplonaAuthenticated.getInitialGameData',
  execute: async (
    params: { levelIds: number[]; clearFriendsCache?: boolean },
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
      include: {
        userStats: {
          where: {
            userId: personaId,
          },
        },
        kitUnlocks: {
          where: {
            userId: personaId,
          },
          include: {
            kit: {
              select: {
                kitType: true,
              },
            },
          },
        },
        itemUnlocks: {
          where: {
            userId: personaId,
          },
        },
        userGeneratedContent: {
          where: {
            creatorId: !params.levelIds.includes(4294967295) ? personaId : '0',
          },
          include: {
            reachThis: true,
            timeTrial: true,
            creator: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    const userStats = user.userStats.reduce(
      (a: { [key: string]: number }, v) => ((a[v.flag] = v.value), a),
      {}
    )

    if (!params.levelIds.includes(4294967295)) {
    }

    return {
      playerInfo: {
        name: user.name,
        location: [],
        division: {
          name: user.division,
          rank: user.divisionRank,
        },
      },
      userStats: userStats,
      userReachThis: user.userGeneratedContent
        .filter((ugc) => ugc.ugcType === 'ReachThis')
        .map((ugc) => extractUGCData(ugc, ['META'])),
      userTimeTrials: user.userGeneratedContent
        .filter((ugc) => ugc.ugcType === 'TimeTrial')
        .map((ugc) => extractUGCData(ugc, ['META'])),
      promotedUGC: user.userGeneratedContent.map((ugc) => ({
        ...extractUGCData(ugc, ['META']),
        reason: 3,
      })),
      bookmarks: {
        ugcBookmarks: [],
        challengeBookmarks: [],
      },
      inventory: {
        kits: user.kitUnlocks.map((kit) => ({
          id: kit.kitId,
          kitType: kit.kit.kitType,
          opened: kit.opened,
        })),
        items: user.itemUnlocks.map((item) => ({
          id: item.itemId,
          count: item.count,
        })),
      },
    }
  },
}
