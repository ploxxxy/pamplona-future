import { getUserFromSession } from '../..'
import db from '../../../common/prisma'
import { extractUGCData } from '../../helper'

export default {
  name: 'PamplonaAuthenticated.getTimeTrialData',
  execute: async (
    params: {
      ugcIds: { userId: string; id: string }[]
      dataTypes: string[]
      personaId: string
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
        timeTrial: {
          id: { in: ugcIds },
        },
        ugcType: 'TimeTrial',
      },
      include: {
        ugcEntries: {
          where: {
            userId: personaId,
          },
        },
        timeTrial: true,
        creator: {
          select: {
            name: true,
          },
        },
      },
    })

    return result.map((ugc) => extractUGCData(ugc, params.dataTypes))

    // return [
    //   {
    //     meta: {
    //       ugcId: {
    //         userId: '1011786733',
    //         id: '97877930-71a3-11ee-aea0-e34b2562c43e',
    //       },
    //       name: 'ploxxxxxxy #11',
    //       creatorName: 'ploxxxxxxy',
    //       createdAt: '1698065793091',
    //       updatedAt: '1698131436874',
    //       published: false,
    //       reported: false,
    //       blocked: false,
    //       levelId: -1940918635,
    //       transform: {
    //         x: 3.10898,
    //         y: 61.4001,
    //         z: 223.15,
    //         qx: 0,
    //         qy: 0.982363,
    //         qz: 0,
    //         qw: -0.186983,
    //       },
    //       teleportTransform: {
    //         x: 3.10898,
    //         y: 61.4001,
    //         z: 223.15,
    //         qx: 0,
    //         qy: 0.982363,
    //         qz: 0,
    //         qw: -0.186983,
    //       },
    //       ugcUrl:
    //         'https://mec-gw.ops.dice.se/ugc/prod_default/prod_default/pc/TimeTrial/1011786733/97877930-71a3-11ee-aea0-e34b2562c43e',
    //       typeId: 'TimeTrial',
    //     },
    //     stats: null,
    //     userStats: {
    //       finishedAt: '1698065815246',
    //       finishTime: '1513',
    //       splitTimes: ['126', '336', '550', '876', '1016', '1280', '1514'],
    //       extraStats: {
    //         wallrun_distance: '3255',
    //         maxperframe_distance: '608',
    //         walk_distance: '68935',
    //         total_distance: '97144',
    //       },
    //     },
    //     userRank: {
    //       rank: 1,
    //       score: '1513',
    //       total: 1,
    //     },
    //   },
    // ]
  },
}
