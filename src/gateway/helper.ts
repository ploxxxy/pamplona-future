import { ReachThis, TimeTrial, Ugc, UgcEntry, User } from '@prisma/client'
import { Readable } from 'node:stream'
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
      x: Float
      y: Float
      z: Float
      qx: Float
      qy: Float
      qz: Float
      qw: Float
    }
    typeId: 'ReachThis' | 'TimeTrial'
  } | null
}

export interface ReachThisData extends BaseUGCData {
  meta:
    | (BaseUGCData['meta'] & {
        mapPosition: {
          x: Float
          y: Float
          z: Float
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
          x: Float
          y: Float
          z: Float
          qx: Float
          qy: Float
          qz: Float
          qw: Float
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
              x: new Float(ugc.transformX),
              y: new Float(ugc.transformY),
              z: new Float(ugc.transformZ),
              qx: new Float(ugc.transformQx),
              qy: new Float(ugc.transformQy),
              qz: new Float(ugc.transformQz),
              qw: new Float(ugc.transformQw),
            },
            mapPosition: {
              // Fixes map icon offset
              // x: ugc.reachThis.mapPositionX,
              // y: ugc.reachThis.mapPositionY,
              // z: ugc.reachThis.mapPositionZ,
              x: new Float(ugc.transformX),
              y: new Float(ugc.transformY),
              z: new Float(ugc.transformZ),
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
              x: new Float(ugc.transformX),
              y: new Float(ugc.transformY),
              z: new Float(ugc.transformZ),
              qx: new Float(ugc.transformQx),
              qy: new Float(ugc.transformQy),
              qz: new Float(ugc.transformQz),
              qw: new Float(ugc.transformQw),
            },
            teleportTransform: {
              x: new Float(ugc.timeTrial.teleportTransformX),
              y: new Float(ugc.timeTrial.teleportTransformY),
              z: new Float(ugc.timeTrial.teleportTransformZ),
              qx: new Float(ugc.timeTrial.teleportTransformQx),
              qy: new Float(ugc.timeTrial.teleportTransformQy),
              qz: new Float(ugc.timeTrial.teleportTransformQz),
              qw: new Float(ugc.timeTrial.teleportTransformQw),
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

export const chunkStringFixed = (str: string, numChunks = 15) => {
  const chunkSize = Math.ceil(str.length / numChunks)
  // const chunks = []

  // for (let i = 0; i < numChunks; i++) {
  //   const start = i * chunkSize
  //   const end =
  //     (i + 1) * chunkSize <= str.length ? (i + 1) * chunkSize : str.length
  //   chunks.push(str.substring(start, end))
  // }

  // return chunks
  const readable = new Readable({ objectMode: true })
  let index = 0
  readable._read = () => {
    if (index >= str.length) {
      readable.push(null)
      return
    }

    const end = Math.min(index + chunkSize, str.length)
    const chunk = str.substring(index, end)
    index = end
    readable.push(chunk)
  }

  return readable
}

export class Float extends Number {}

export function monkeyStringify(obj?: object): string {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return value(obj)
  }

  return `{${Object.keys(obj)
    .map((k) =>
      typeof obj[k] === 'function' ? null : `"${k}":${value(obj[k])}`
    )
    .filter((i) => i)}}`
}

function value(val: unknown): string | undefined {
  switch (typeof val) {
    case 'string':
      return `"${val.replace(/\\/g, '\\\\').replace('"', '\\"')}"`
    case 'number':
    case 'boolean':
      return `${val}`
    case 'function':
      console.log('got function')
      return 'null'
    case 'object':
      if (val instanceof Date) return `"${val.toISOString()}"`
      if (val instanceof Float) return val.toFixed(1)
      if (Array.isArray(val)) return `[${val.map(value).join(',')}]`
      if (val === null) {
        return 'null'
      }
      return monkeyStringify(val)
  }
}
