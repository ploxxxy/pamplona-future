import db from '../../../common/prisma'
import { extractUGCData } from '../../helper'

export default {
  name: 'Pamplona.getReachThisData',
  execute: async (params: {
    personaId: number
    ugcIds: { id: string; userId: number }[]
    dataTypes: string[]
  }) => {
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
        creator: {
          select: {
            name: true,
          },
        },
        reachThis: true,
      },
    })

    return result.map((ugc) => extractUGCData(ugc, params.dataTypes))
  },
}
