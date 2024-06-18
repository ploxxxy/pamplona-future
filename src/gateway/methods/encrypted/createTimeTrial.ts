import db from '../../../common/prisma'
import { extractUGCData } from '../../helper'
import { getUserFromSession } from '../../index'

export default {
  name: 'PamplonaAuthenticated.createTimeTrial',
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
        teleportTransform: {
          x: number
          y: number
          z: number
          qx: number
          qy: number
          qz: number
          qw: number
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
        creatorId: user.personaId,
        name: params.meta.name,
        createdAt: Date.now().toString(),
        updatedAt: Date.now().toString(),
        published: params.meta.published,
        transformX: params.meta.transform.x,
        transformY: params.meta.transform.y,
        transformZ: params.meta.transform.z,
        transformQx: params.meta.transform.qx,
        transformQy: params.meta.transform.qy,
        transformQz: params.meta.transform.qz,
        transformQw: params.meta.transform.qw,
        timeTrial: {
          create: {
            teleportTransformX: params.meta.teleportTransform.x,
            teleportTransformY: params.meta.teleportTransform.y,
            teleportTransformZ: params.meta.teleportTransform.z,
            teleportTransformQx: params.meta.teleportTransform.qx,
            teleportTransformQy: params.meta.teleportTransform.qy,
            teleportTransformQz: params.meta.teleportTransform.qz,
            teleportTransformQw: params.meta.teleportTransform.qw,
          },
        },
        ugcType: 'TimeTrial',
      },
      include: {
        timeTrial: true,
        creator: {
          select: {
            name: true,
          },
        },
      },
    })

    const timeTrialData = extractUGCData(result, ['META'])

    if (!result.timeTrial || !timeTrialData) {
      throw new Error('TimeTrial not created')
    }

    return timeTrialData.meta
  },
}
