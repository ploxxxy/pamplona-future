import db from '../../../common/prisma'
import { extractUGCData } from '../../helper'

export default {
  name: 'Pamplona.getTimeTrialData',
  execute: async (params: {
    personaId: number
    ugcIds: { id: string; userId: number }[]
    dataTypes: string[]
  }) => {
    const ugcIds = params.ugcIds.map((ugc) => ugc.id)

    const result = await db.ugc.findMany({
      where: {
        timeTrial: {
          id: {
            in: ugcIds,
          },
        },
        ugcType: 'TimeTrial',
      },
      include: {
        creator: {
          select: {
            name: true,
          },
        },
        timeTrial: true,
        ugcEntries: {
          where: {
            userId: params.personaId.toString(),
          }
        }
      },
    })

    return result.map((ugc) => extractUGCData(ugc, params.dataTypes))
  },
}
