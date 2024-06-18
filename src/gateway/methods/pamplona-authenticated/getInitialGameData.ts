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
                rewards: true,
              },
            },
          },
        },
        userGeneratedContent: {
          where: {
            creatorId: personaId,
            levelId: params.levelIds[0] << 0,
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
      promotedUGC: [],
      bookmarks: {
        ugcBookmarks: [],
        challengeBookmarks: [
          {
            challengeId: 'ch_rrt_bm1_time',
            bookmarkTime: '1581876387148',
            challengeType: 'RunnersRoute',
          },
        ],
      },
      inventory: {
        kits: user.kitUnlocks.map((kit) => ({
          id: kit.kitId,
          kitType: kit.kit.kitType,
          opened: kit.opened,
        })),
        items: user.kitUnlocks.flatMap((kit) =>
          kit.kit.rewards.map((reward) => ({
            id: reward.id,
            count: 1,
          }))
        ),
      },
    }
  },
}
