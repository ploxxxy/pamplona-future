import { getUserFromSession } from '../..'
import db from '../../../common/prisma'
import { getInventoryFromDb } from './getInventory'

export default {
  name: 'PamplonaAuthenticated.getInitialGameData',
  execute: async (
    params: { levelIds: number[]; clearFriendsCache: boolean },
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
        },
        itemUnlocks: {
          where: {
            userId: personaId,
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

    let returnObject = {
      playerInfo: {
        name: user.name,
        location: [
          {
            type: 'country',
            name: 'Ukraine',
            cc: 'UA',
            id: '690791',
          },
          {
            type: 'locality',
            name: 'Kyiv',
            cc: 'UA',
            id: '703448',
          },
        ],
        division: {
          name: user.division,
          rank: user.divisionRank,
        },
      },
      userStats: userStats,
      userReachThis: [],
      userTimeTrials: [],
      promotedUGC: [],
      bookmarks: {
        ugcBookmarks: [],
        challengeBookmarks: [],
      },
      inventory: await getInventoryFromDb(personaId),
    }

    // if (params.levelIds[0] === 2354048661) {
    //   const userReachThisPromise = db.reachThis.findMany({
    //     where: {
    //       creatorId: personaId,
    //     },
    //   })

    //   const userTimeTrialsPromise = db.timeTrial.findMany({
    //     where: { creatorId: personaId },
    //   })

    //   const promotedReachThisPromise = db.reachThis.findMany({
    //     where: {
    //       creatorId: {
    //         not: personaId,
    //       },
    //     },
    //     take: 5,
    //   })

    //   const promotedTimeTrialsPromise = db.timeTrial.findMany({
    //     where: {
    //       creatorId: {
    //         not: personaId,
    //       },
    //     },
    //     take: 5,
    //   })

    //   // const ugcBookmarksPromise = prisma.uGCBookmark.findMany({
    //   //   where: {
    //   //     userId: personaId,
    //   //   },
    //   // })

    //   // const challengeBookmarksPromise = prisma.challengeBookmark.findMany({
    //   //   where: {
    //   //     userId: personaId,
    //   //   },
    //   // })

    //   await Promise.allSettled([
    //     userReachThisPromise,
    //     userTimeTrialsPromise,
    //     promotedReachThisPromise,
    //     promotedTimeTrialsPromise,
    //     // ugcBookmarksPromise,
    //     // challengeBookmarksPromise,
    //   ]).then(
    //     ([
    //       userReachThis,
    //       userTimeTrials,
    //       promotedReachThis,
    //       promotedTimeTrials,
    //       // ugcBookmarks,
    //       // challengeBookmarks,
    //     ]) => {
    //       if (userReachThis.status === 'fulfilled') {
    //         returnObject.playerInfo.userReachThis = userReachThis.value.map(
    //           (reachThis) => {
    //             return {
    //               meta: {
    //                 ugcId: {
    //                   userId: reachThis.creatorId,
    //                   id: reachThis.id,
    //                 },
    //                 name: reachThis.name,
    //                 creatorName: user.name,
    //                 createdAt: reachThis.createdAt,
    //                 updatedAt: reachThis.updatedAt,
    //                 published: reachThis.published,
    //                 reported: false,
    //                 blocked: false,
    //                 levelId: -1940918635,
    //                 transform: {
    //                   x: reachThis.transformX,
    //                   y: reachThis.transformY,
    //                   z: reachThis.transformZ,
    //                   qx: reachThis.transformQx,
    //                   qy: reachThis.transformQy,
    //                   qz: reachThis.transformQz,
    //                   qw: reachThis.transformQw,
    //                 },
    //                 mapPosition: {
    //                   x: reachThis.mapPositionX,
    //                   y: reachThis.mapPositionY,
    //                   z: reachThis.mapPositionZ,
    //                 },
    //                 typeId: 'ReachThis',
    //               },
    //               stats: null,
    //               userStats: null,
    //               userRank: null,
    //             }
    //           }
    //         ) as never[] // shut up typescript
    //       }

    //       if (userTimeTrials.status === 'fulfilled') {
    //         returnObject.playerInfo.userTimeTrials = userTimeTrials.value.map(
    //           (timeTrial) => {
    //             return {
    //               meta: {
    //                 ugcId: {
    //                   userId: timeTrial.creatorId,
    //                   id: timeTrial.id,
    //                 },
    //                 name: timeTrial.name,
    //                 creatorName: user.name,
    //                 createdAt: timeTrial.createdAt,
    //                 updatedAt: timeTrial.updatedAt,
    //                 published: timeTrial.published,
    //                 reported: false,
    //                 blocked: false,
    //                 levelId: -1940918635,
    //                 transform: {
    //                   x: timeTrial.transformX,
    //                   y: timeTrial.transformY,
    //                   z: timeTrial.transformZ,
    //                   qx: timeTrial.transformQx,
    //                   qy: timeTrial.transformQy,
    //                   qz: timeTrial.transformQz,
    //                   qw: timeTrial.transformQw,
    //                 },
    //                 teleportTransform: {
    //                   x: timeTrial.teleportTransformX,
    //                   y: timeTrial.teleportTransformY,
    //                   z: timeTrial.teleportTransformZ,
    //                   qx: timeTrial.teleportTransformQx,
    //                   qy: timeTrial.teleportTransformQy,
    //                   qz: timeTrial.teleportTransformQz,
    //                   qw: timeTrial.teleportTransformQw,
    //                 },
    //                 ugcUrl: 'placeholder.com', // TODO: Implement
    //                 typeId: 'TimeTrial',
    //               },
    //               stats: null,
    //               userStats: null,
    //               userRank: null,
    //             }
    //           }
    //         ) as never[] // shut up typescript
    //       }

    //       const promotedUGC = []

    //       if (promotedReachThis.status === 'fulfilled') {
    //         promotedUGC.push(
    //           ...promotedReachThis.value.map((reachThis) => {
    //             return {
    //               meta: {
    //                 ugcId: {
    //                   userId: reachThis.creatorId,
    //                   id: reachThis.id,
    //                 },
    //                 name: reachThis.name,
    //                 creatorName: reachThis.creatorName,
    //                 createdAt: reachThis.createdAt,
    //                 updatedAt: reachThis.updatedAt,
    //                 published: reachThis.published,
    //                 reported: false,
    //                 blocked: false,
    //                 levelId: -1940918635,
    //                 transform: {
    //                   x: reachThis.transformX,
    //                   y: reachThis.transformY,
    //                   z: reachThis.transformZ,
    //                   qx: reachThis.transformQx,
    //                   qy: reachThis.transformQy,
    //                   qz: reachThis.transformQz,
    //                   qw: reachThis.transformQw,
    //                 },
    //                 mapPosition: {
    //                   x: reachThis.mapPositionX,
    //                   y: reachThis.mapPositionY,
    //                   z: reachThis.mapPositionZ,
    //                 },
    //                 typeId: 'ReachThis',
    //               },
    //               reason: 3, // TODO: figure out (6 = friend, 3 = random ?)
    //             }
    //           })
    //         )
    //       }

    //       if (promotedTimeTrials.status === 'fulfilled') {
    //         promotedUGC.push(
    //           ...promotedTimeTrials.value.map((timeTrial) => {
    //             return {
    //               meta: {
    //                 ugcId: {
    //                   userId: timeTrial.creatorId,
    //                   id: timeTrial.id,
    //                 },
    //                 name: timeTrial.name,
    //                 creatorName: timeTrial.creatorName,
    //                 createdAt: timeTrial.createdAt,
    //                 updatedAt: timeTrial.updatedAt,
    //                 published: timeTrial.published,
    //                 reported: false,
    //                 blocked: false,
    //                 levelId: -1940918635,
    //                 transform: {
    //                   x: timeTrial.transformX,
    //                   y: timeTrial.transformY,
    //                   z: timeTrial.transformZ,
    //                   qx: timeTrial.transformQx,
    //                   qy: timeTrial.transformQy,
    //                   qz: timeTrial.transformQz,
    //                   qw: timeTrial.transformQw,
    //                 },
    //                 teleportTransform: {
    //                   x: timeTrial.teleportTransformX,
    //                   y: timeTrial.teleportTransformY,
    //                   z: timeTrial.teleportTransformZ,
    //                   qx: timeTrial.teleportTransformQx,
    //                   qy: timeTrial.teleportTransformQy,
    //                   qz: timeTrial.teleportTransformQz,
    //                   qw: timeTrial.teleportTransformQw,
    //                 },
    //                 ugcUrl: 'placeholder.com', // TODO: Implement
    //                 typeId: 'TimeTrial',
    //               },
    //               reason: 3, // TODO: figure out (6 = friend, 3 = random ?)
    //             }
    //           })
    //         )
    //       }

    //       returnObject.playerInfo.promotedUGC = promotedUGC as never[] // shut up typescript
    //     }
    //   )
    // }

    return returnObject
  },
}
