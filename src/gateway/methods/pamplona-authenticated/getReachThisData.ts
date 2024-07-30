import { getUserFromSession } from '../..'
import db from '../../../common/prisma'
import { extractUGCData } from '../../helper'

export default {
  name: 'PamplonaAuthenticated.getReachThisData',
  execute: async (
    params: {
      ugcIds: { userId: string; id: string }[]
      dataTypes: string[]
    },
    session: string
  ) => {
    const personaId = getUserFromSession(session)

    if (!personaId) {
      throw new Error('Invalid session')
    }

    const ugcIds = params.ugcIds.map((ugc) => ugc.id)

    const result = await db.ugc.findMany({
      where: {
        reachThis: {
          id: {
            in: ugcIds,
          },
        },
        ugcType: 'ReachThis',
      },
      include: {
        ugcEntries: {
          where: {
            userId: personaId,
          },
        },
        reachThis: true,
        creator: {
          select: {
            name: true,
          },
        },
      },
    })

    return result.map((ugc) => extractUGCData(ugc, params.dataTypes))
  },
}
