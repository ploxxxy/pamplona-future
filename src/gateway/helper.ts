import { ReachThis, TimeTrial, Ugc, UgcEntry, User } from '@prisma/client'
import pino from 'pino'

export const logger = pino({
  msgPrefix: '[Gateway] ',
  level: 'debug',
})

interface BaseUGCData {
  meta: {
    ugcId: {
      userId: string
      id: string
    }
    name: string
    creatorName: string
    createdAt: string
    updatedAt: string
    published: boolean
    reported: boolean
    blocked: boolean
    levelId: number
    transform: {
      x: number
      y: number
      z: number
      qx: number
      qy: number
      qz: number
      qw: number
    }
    typeId: 'ReachThis' | 'TimeTrial'
  } | null
}

export interface ReachThisData extends BaseUGCData {
  meta:
    | (BaseUGCData['meta'] & {
        mapPosition: {
          x: number
          y: number
          z: number
        }
        typeId: 'ReachThis'
      })
    | null
  stats: null
  userStats: {
    reachedAt: string
  } | null
  userRank: {
    rank: number
    score: string
    total: number
  } | null
}

export interface TimeTrialData extends BaseUGCData {
  meta:
    | (BaseUGCData['meta'] & {
        teleportTransform: {
          x: number
          y: number
          z: number
          qx: number
          qy: number
          qz: number
          qw: number
        }
        ugcUrl: string
        typeId: 'TimeTrial'
      })
    | null
  stats: null
  userStats: {
    finishedAt: string
    finishTime: string
    splitTimes: string[]
    extraStats: {
      wallrun_distance: string
      maxperframe_distance: string
      walk_distance: string
      total_distance: string
    }
  } | null
  userRank: {
    rank: number
    score: string
    total: number
  } | null
}

interface ExtendedUgc extends Ugc {
  reachThis?: ReachThis | null
  timeTrial?: TimeTrial | null
  creator: Pick<User, 'name'>
  ugcEntries?: UgcEntry[]
}

export const extractUGCData = (
  ugc: ExtendedUgc,
  dataTypes: ('META' | 'STATS' | 'USER_STATS')[] | string[]
): ReachThisData | TimeTrialData | null => {
  const needMeta = dataTypes.includes('META')
  const needUserStats = dataTypes.includes('USER_STATS')
  const ugcEntry = ugc.ugcEntries?.[0] ?? null

  if (ugc.ugcType === 'ReachThis' && ugc.reachThis) {
    const userStats = ugcEntry
      ? {
          reachedAt: ugcEntry.finishedAt,
        }
      : null

    const userRank = ugcEntry
      ? {
          rank: 1, // TODO: Implement ranking
          score: ugcEntry.finishedAt,
          total: 1,
        }
      : null

    return {
      meta: needMeta
        ? {
            ugcId: {
              userId: ugc.creatorId,
              id: ugc.reachThis.id,
            },
            name: ugc.name,
            creatorName: ugc.creator.name,
            createdAt: ugc.createdAt,
            updatedAt: ugc.updatedAt,
            published: ugc.published,
            reported: false,
            blocked: false,
            levelId: ugc.levelId,
            transform: {
              x: ugc.transformX,
              y: ugc.transformY,
              z: ugc.transformZ,
              qx: ugc.transformQx || 0.000001,
              qy: ugc.transformQy,
              qz: ugc.transformQz || 0.000001,
              qw: ugc.transformQw,
            },
            mapPosition: {
              // Fixes map icon offset
              // x: ugc.reachThis.mapPositionX,
              // y: ugc.reachThis.mapPositionY,
              // z: ugc.reachThis.mapPositionZ,
              x: ugc.transformX,
              y: ugc.transformY,
              z: ugc.transformZ,
            },
            typeId: 'ReachThis',
          }
        : null,
      stats: null,
      userStats: needUserStats ? userStats : null,
      userRank: needUserStats ? userRank : null,
    }
  } else if (ugc.ugcType === 'TimeTrial' && ugc.timeTrial) {
    const userStats = ugcEntry
      ? {
          finishedAt: ugcEntry.finishedAt,
          finishTime: ugcEntry.finishedAt,
          splitTimes: ugcEntry.splitTimes,
          extraStats: {
            wallrun_distance: ugcEntry.wallrunDistance || '0',
            maxperframe_distance: ugcEntry.maxperframeDistance || '0',
            walk_distance: ugcEntry.walkDistance || '0',
            total_distance: ugcEntry.totalDistance || '0',
          },
        }
      : null

    const userRank = ugcEntry
      ? {
          // TODO: Implement ranking
          rank: 1,
          score: ugcEntry.finishedAt,
          total: 1,
        }
      : null

    return {
      meta: needMeta
        ? {
            ugcId: {
              userId: ugc.creatorId,
              id: ugc.timeTrial.id,
            },
            name: ugc.name,
            creatorName: ugc.creator.name,
            createdAt: ugc.createdAt,
            updatedAt: ugc.updatedAt,
            published: ugc.published,
            reported: false,
            blocked: false,
            levelId: ugc.levelId,
            transform: {
              x: ugc.transformX,
              y: ugc.transformY,
              z: ugc.transformZ,
              qx: ugc.transformQx || 0.000001,
              qy: ugc.transformQy,
              qz: ugc.transformQz || 0.000001,
              qw: ugc.transformQw,
            },
            teleportTransform: {
              x: ugc.timeTrial.teleportTransformX,
              y: ugc.timeTrial.teleportTransformY,
              z: ugc.timeTrial.teleportTransformZ,
              qx: ugc.timeTrial.teleportTransformQx || 0.000001,
              qy: ugc.timeTrial.teleportTransformQy,
              qz: ugc.timeTrial.teleportTransformQz || 0.000001,
              qw: ugc.timeTrial.teleportTransformQw,
            },
            ugcUrl: `https://mec-gw.ops.dice.se/ugc/prod_default/prod_default/pc/TimeTrial/${ugc.creatorId}/${ugc.timeTrial.id}`,
            typeId: 'TimeTrial',
          }
        : null,
      stats: null,
      userStats: needUserStats ? userStats : null,
      userRank: needUserStats ? userRank : null,
    }
  } else {
    return null
  }
}
