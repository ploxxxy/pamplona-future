import { getUserFromSession } from '../..'
import db from '../../../common/prisma'
import { extractUGCData } from '../../helper'

export default {
  name: 'PamplonaAuthenticated.createReachThis',
  execute: async (
    params: {
      meta: {
        name: string
        levelId: number
        published: boolean
        transform: {
          x: number
          y: number
          z: number
          qx: number
          qy: number
          qz: number
          qw: number
        }
        mapPosition: {
          x: number
          y: number
          z: number
        }
      }
      data: string
    },
    session: string
  ) => {
    const personaId = getUserFromSession(session)

    if (!personaId) {
      throw new Error('Invalid session')
    }

    console.log(params)

    const user = await db.user.findFirst({
      where: {
        personaId,
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    const result = await db.ugc.create({
      data: {
        createdAt: Date.now().toString(),
        updatedAt: Date.now().toString(),
        creatorId: personaId,
        ugcType: 'ReachThis',
        // levelId: params.meta.levelId, // In my logs its negative number, int overflow?
        published: params.meta.published,
        name: params.meta.name,
        transformX: params.meta.transform.x,
        transformY: params.meta.transform.y,
        transformZ: params.meta.transform.z,
        transformQx: params.meta.transform.qx,
        transformQy: params.meta.transform.qy,
        transformQz: params.meta.transform.qz,
        transformQw: params.meta.transform.qw,
        reachThis: {
          create: {
            // TODO: check if removes weird offset in-game
            mapPositionX: params.meta.mapPosition.x,
            mapPositionY: params.meta.mapPosition.y,
            mapPositionZ: params.meta.mapPosition.z,
            // mapPositionX: params.meta.transform.x,
            // mapPositionY: params.meta.transform.y,
            // mapPositionZ: params.meta.transform.z,
          },
        },
      },
      include: {
        reachThis: true,
        creator: {
          select: {
            name: true,
          },
        },
      },
    })

    const reachThisData = extractUGCData(result, ['META'])

    if (!result.reachThis || !reachThisData) {
      throw new Error('ReachThis not created')
    }

    return reachThisData.meta
  },
}
