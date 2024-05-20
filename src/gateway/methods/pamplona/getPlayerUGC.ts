import db from '../../../common/prisma'
import { extractUGCData } from '../../helper'

export default {
  name: 'Pamplona.getPlayerUGC',
  execute: async (params: { levelIds: number[]; personaId: number }) => {
    const playerUGC = await db.ugc.findMany({
      where: {
        creatorId: params.personaId.toString(),
        levelId: {
          in: params.levelIds,
        },
      },
      include: {
        creator: {
          select: {
            name: true,
          },
        },
        reachThis: true,
        timeTrial: true,
      },
    })

    return {
      playerReachThis: playerUGC
        .filter((ugc) => ugc.ugcType === 'ReachThis')
        .map((ugc) => extractUGCData(ugc, ['META'])),
      playerTimeTrials: playerUGC
        .filter((ugc) => ugc.ugcType === 'TimeTrial')
        .map((ugc) => extractUGCData(ugc, ['META'])),
    }
  },
}
