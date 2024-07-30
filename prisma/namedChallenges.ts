import { PrismaClient } from '@prisma/client'

const namedChallenges = [
  {
    id: 'ID_NC_HACKABLE_SCREEN_DT_08',
    contentId: '2185946613',
    challengeType: 'HackableBillboard',
    challengeStats: ['ch_hbb_dt08sh_tstamp'],
  },
  {
    id: 'ID_NC_HACKABLE_SCREEN_DT_03',
    contentId: '2531054494',
    challengeType: 'HackableBillboard',
    challengeStats: ['ch_hbb_dt03sh_tstamp'],
  },
  {
    id: 'ID_NC_HACKABLE_SCREEN_AC_03',
    contentId: '2058259244',
    challengeType: 'HackableBillboard',
    challengeStats: ['ch_hbb_ac03sh_tstamp'],
  },
  {
    id: 'ID_NC_HACKABLE_SCREEN_VW_04',
    contentId: '1190460552',
    challengeType: 'HackableBillboard',
    challengeStats: ['ch_hbb_vw04sh_tstamp'],
  },
  {
    id: 'ID_BILLBOARD_DT02',
    contentId: '23725140',
    challengeType: 'HackableBillboard',
    challengeStats: ['ch_hbb_dt2_tstamp'],
  },
  {
    id: 'ID_BILLBOARD_ANC02',
    contentId: '1145204056',
    challengeType: 'HackableBillboard',
    challengeStats: ['ch_hbb_anc02_tstamp'],
  },
  {
    id: 'ID_BILLBOARD_ANC01',
    contentId: '919185787',
    challengeType: 'HackableBillboard',
    challengeStats: ['ch_hbb_anc01_tstamp'],
  },
  {
    id: 'ID_BILLBOARD_ANC03',
    contentId: '403919289',
    challengeType: 'HackableBillboard',
    challengeStats: ['ch_hbb_anc03_tstamp'],
  },
  {
    id: 'ID_BILLBOARD_VW01',
    contentId: '1705023253',
    challengeType: 'HackableBillboard',
    challengeStats: ['ch_hbb_tvbb01_tstamp'],
  },
  {
    id: 'ID_BILLBOARD_REZ02',
    contentId: '430943676',
    challengeType: 'HackableBillboard',
    challengeStats: ['ch_hbb_rz02_tstamp'],
  },
  {
    id: 'ID_NC_HACKABLE_SCREEN_RZ_04',
    contentId: '792418465',
    challengeType: 'HackableBillboard',
    challengeStats: ['ch_hbb_rz04sh_tstamp'],
  },
  {
    id: 'ID_BILLBOARD_REZ01',
    contentId: '2607942751',
    challengeType: 'HackableBillboard',
    challengeStats: ['ch_hbb_rz01_tstamp'],
  },
  {
    id: 'ID_BILLBOARD_DT01',
    contentId: '4092674167',
    challengeType: 'HackableBillboard',
    challengeStats: ['ch_hbb_dt1_tstamp'],
  },
  {
    id: 'ID_BILLBOARD_DT03',
    contentId: '3577407669',
    challengeType: 'HackableBillboard',
    challengeStats: ['ch_hbb_dt3_tstamp'],
  },
  {
    id: 'ID_BILLBOARD_DT04',
    contentId: '3500117394',
    challengeType: 'HackableBillboard',
    challengeStats: ['ch_hbb_dt4_tstamp'],
  },
  {
    id: 'ID_BILLBOARD_VW02',
    contentId: '972942838',
    challengeType: 'HackableBillboard',
    challengeStats: ['ch_hbb_tvbb02_tstamp'],
  },
  {
    id: 'ID_BILLBOARD_VW03',
    contentId: '2427482583',
    challengeType: 'HackableBillboard',
    challengeStats: ['ch_hbb_tvbb03_tstamp'],
  },
  {
    id: 'ID_NC_THEVIEW02',
    contentId: '919100032',
    challengeType: 'RunnersRoute',
    challengeStats: [
      'ch_rrt_tv2_time',
      'ch_rrt_tv2_walk_distance',
      'ch_rrt_tv2_wallrun_distance',
      'ch_rrt_tv2_total_distance',
      'ch_rrt_tv2_maxperframe_distance',
    ],
  },
  {
    id: 'ID_NC_THEVIEW04',
    contentId: '3692815414',
    challengeType: 'RunnersRoute',
    challengeStats: [
      'ch_rrt_tv04_time',
      'ch_rrt_tv04_walk_distance',
      'ch_rrt_tv04_wallrun_distance',
      'ch_rrt_tv04_total_distance',
      'ch_rrt_tv04_maxperframe_distance',
    ],
  },
  {
    id: 'ID_NC_DOWNTOWN04',
    contentId: '1266191060',
    challengeType: 'RunnersRoute',
    challengeStats: [
      'ch_rrt_dt4_time',
      'ch_rrt_dt4_walk_distance',
      'ch_rrt_dt4_wallrun_distance',
      'ch_rrt_dt4_total_distance',
      'ch_rrt_dt4_maxperframe_distance',
    ],
  },
  {
    id: 'ID_NC_THEVIEW03',
    contentId: '1107729249',
    challengeType: 'RunnersRoute',
    challengeStats: [
      'ch_rrt_tv3_time',
      'ch_rrt_tv3_walk_distance',
      'ch_rrt_tv3_wallrun_distance',
      'ch_rrt_tv3_total_distance',
      'ch_rrt_tv3_maxperframe_distance',
    ],
  },
  {
    id: 'ID_NC_ANCHOR01',
    contentId: '923895117',
    challengeType: 'RunnersRoute',
    challengeStats: [
      'ch_rrt_anc1_time',
      'ch_rrt_anc1_walk_distance',
      'ch_rrt_anc1_wallrun_distance',
      'ch_rrt_anc1_total_distance',
      'ch_rrt_anc1_maxperframe_distance',
    ],
  },
  {
    id: 'ID_NC_DOWNTOWN01',
    contentId: '1003612465',
    challengeType: 'RunnersRoute',
    challengeStats: [
      'ch_rrt_dt1_time',
      'ch_rrt_dt1_walk_distance',
      'ch_rrt_dt1_wallrun_distance',
      'ch_rrt_dt1_total_distance',
      'ch_rrt_dt1_maxperframe_distance',
    ],
  },
  {
    id: 'ID_NC_CONSTR02',
    contentId: '614507179',
    challengeType: 'RunnersRoute',
    challengeStats: [
      'ch_rrt_rz3_time',
      'ch_rrt_rz3_walk_distance',
      'ch_rrt_rz3_wallrun_distance',
      'ch_rrt_rz3_total_distance',
      'ch_rrt_rz3_maxperframe_distance',
    ],
  },
  {
    id: 'ID_NC_THEVIEW05',
    contentId: '3729646487',
    challengeType: 'RunnersRoute',
    challengeStats: [
      'ch_rrt_tv05_time',
      'ch_rrt_tv05_walk_distance',
      'ch_rrt_tv05_wallrun_distance',
      'ch_rrt_tv05_total_distance',
      'ch_rrt_tv05_maxperframe_distance',
    ],
  },
  {
    id: 'ID_NC_DOWNTOWNCANYON',
    contentId: '893385106',
    challengeType: 'RunnersRoute',
    challengeStats: [
      'ch_rrt_dt2_time',
      'ch_rrt_dt2_walk_distance',
      'ch_rrt_dt2_wallrun_distance',
      'ch_rrt_dt2_total_distance',
      'ch_rrt_dt2_maxperframe_distance',
    ],
  },
  {
    id: 'ID_NC_CONSTR03',
    contentId: '798683916',
    challengeType: 'RunnersRoute',
    challengeStats: [
      'ch_rrt_rz4_time',
      'ch_rrt_rz4_walk_distance',
      'ch_rrt_rz4_wallrun_distance',
      'ch_rrt_rz4_total_distance',
      'ch_rrt_rz4_maxperframe_distance',
    ],
  },
  {
    id: 'ID_NC_NOMADSRUN',
    contentId: '1082022771',
    challengeType: 'RunnersRoute',
    challengeStats: [
      'ch_rrt_dt3_time',
      'ch_rrt_dt3_walk_distance',
      'ch_rrt_dt3_wallrun_distance',
      'ch_rrt_dt3_total_distance',
      'ch_rrt_dt3_maxperframe_distance',
    ],
  },
  {
    id: 'ID_NC_ANCHOR04',
    contentId: '739722600',
    challengeType: 'RunnersRoute',
    challengeStats: [
      'ch_rrt_anc4_time',
      'ch_rrt_anc4_walk_distance',
      'ch_rrt_anc4_wallrun_distance',
      'ch_rrt_anc4_total_distance',
      'ch_rrt_anc4_maxperframe_distance',
    ],
  },
  {
    id: 'ID_NC_ANCHOR05',
    contentId: '776553673',
    challengeType: 'RunnersRoute',
    challengeStats: [
      'ch_rrt_anc5_time',
      'ch_rrt_anc5_walk_distance',
      'ch_rrt_anc5_wallrun_distance',
      'ch_rrt_anc5_total_distance',
      'ch_rrt_anc5_maxperframe_distance',
    ],
  },
  {
    id: 'ID_NC_BIRDMANS_ROUTE',
    contentId: '1781754350',
    challengeType: 'RunnersRoute',
    challengeStats: [
      'ch_rrt_bm1_time',
      'ch_rrt_bm1_walk_distance',
      'ch_rrt_bm1_wallrun_distance',
      'ch_rrt_bm1_total_distance',
      'ch_rrt_bm1_maxperframe_distance',
    ],
  },
  {
    id: 'ID_NC_ANCHOR06',
    contentId: '818132650',
    challengeType: 'RunnersRoute',
    challengeStats: [
      'ch_rrt_anc6_time',
      'ch_rrt_anc6_walk_distance',
      'ch_rrt_anc6_wallrun_distance',
      'ch_rrt_anc6_total_distance',
      'ch_rrt_anc6_maxperframe_distance',
    ],
  },
  {
    id: 'ID_NC_THEVIEW01',
    contentId: '882264739',
    challengeType: 'RunnersRoute',
    challengeStats: [
      'ch_rrt_tv1_time',
      'ch_rrt_tv1_walk_distance',
      'ch_rrt_tv1_wallrun_distance',
      'ch_rrt_tv1_total_distance',
      'ch_rrt_tv1_maxperframe_distance',
    ],
  },
  {
    id: 'ID_NC_DOWNTOWN6',
    contentId: '1040726550',
    challengeType: 'RunnersRoute',
    challengeStats: [
      'ch_rrt_dt6_time',
      'ch_rrt_dt6_walk_distance',
      'ch_rrt_dt6_wallrun_distance',
      'ch_rrt_dt6_total_distance',
      'ch_rrt_dt6_maxperframe_distance',
    ],
  },
  {
    id: 'ID_NC_ANCHOR02',
    contentId: '965474094',
    challengeType: 'RunnersRoute',
    challengeStats: [
      'ch_rrt_anc2_time',
      'ch_rrt_anc2_walk_distance',
      'ch_rrt_anc2_wallrun_distance',
      'ch_rrt_anc2_total_distance',
      'ch_rrt_anc2_maxperframe_distance',
    ],
  },
  {
    id: 'ID_NC_TUNNELS01',
    contentId: '729752778',
    challengeType: 'RunnersRoute',
    challengeStats: [
      'ch_rrt_rz2_time',
      'ch_rrt_rz2_walk_distance',
      'ch_rrt_rz2_wallrun_distance',
      'ch_rrt_rz2_total_distance',
      'ch_rrt_rz2_maxperframe_distance',
    ],
  },
  {
    id: 'ID_NC_ANCHOR03',
    contentId: '1002305167',
    challengeType: 'RunnersRoute',
    challengeStats: [
      'ch_rrt_anc3_time',
      'ch_rrt_anc3_walk_distance',
      'ch_rrt_anc3_wallrun_distance',
      'ch_rrt_anc3_total_distance',
      'ch_rrt_anc3_maxperframe_distance',
    ],
  },
  {
    id: 'ID_NC_DOWNTOWNSWING',
    contentId: '1150953909',
    challengeType: 'RunnersRoute',
    challengeStats: [
      'ch_rrt_dt5_time',
      'ch_rrt_dt5_walk_distance',
      'ch_rrt_dt5_wallrun_distance',
      'ch_rrt_dt5_total_distance',
      'ch_rrt_dt5_maxperframe_distance',
    ],
  },
  {
    id: 'ID_NC_CONSTR01',
    contentId: '839971689',
    challengeType: 'RunnersRoute',
    challengeStats: [
      'ch_rrt_rz1_time',
      'ch_rrt_rz1_walk_distance',
      'ch_rrt_rz1_wallrun_distance',
      'ch_rrt_rz1_total_distance',
      'ch_rrt_rz1_maxperframe_distance',
    ],
  },
  {
    id: 'ID_NC_HACKABLE_SCREEN_DT_TRAINSTATION',
    contentId: '2093312282',
    challengeType: 'HackableBillboard',
    challengeStats: ['ch_hbb_dttssh_tstamp'],
  },
] as const

export async function main(prisma: PrismaClient) {
  await prisma.$transaction(
    namedChallenges.map((namedChallenge) => {
      return prisma.challenge.create({
        data: {
          id: namedChallenge.id,
          contentId: namedChallenge.contentId,
          challengeType: namedChallenge.challengeType,
          challengeStats: {
            connectOrCreate: namedChallenge.challengeStats.map(
              (challengeStat: string) => ({
                where: { code: challengeStat },
                create: { code: challengeStat },
              })
            ),
          },
        },
      })
    })
  )
}
