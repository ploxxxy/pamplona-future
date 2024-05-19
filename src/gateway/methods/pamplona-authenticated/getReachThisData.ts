export default {
  name: 'PamplonaAuthenticated.getReachThisData',
  execute(params: {
    ugcIds: { userId: string; id: string }[]
    dataTypes: string[]
    personaId: string
  }) {
    console.log('need reachthis data for', params.ugcIds)

    // return [
    //   {
    //     meta: {
    //       ugcId: {
    //         userId: '1011786733',
    //         id: 'fdc79be0-7288-11ee-aea0-e34b2562c43e',
    //       },
    //       name: 'ploxxxxxxy #12',
    //       creatorName: 'ploxxxxxxy',
    //       createdAt: '1698164319390',
    //       updatedAt: '1698164319390',
    //       published: true,
    //       reported: false,
    //       blocked: false,
    //       levelId: -1940918635,
    //       transform: {
    //         x: -105.419,
    //         y: 42.2597,
    //         z: 6.51815,
    //         qx: 0,
    //         qy: -0.572233,
    //         qz: 0,
    //         qw: 0.820091,
    //       },
    //       mapPosition: {
    //         x: -62.3142,
    //         y: 42.2597,
    //         z: -11.1907,
    //       },
    //       typeId: 'ReachThis',
    //     },
    //     stats: null,
    //     userStats: {
    //       reachedAt: '1698164321121',
    //     },
    //     userRank: {
    //       rank: 1,
    //       score: '1698164321121',
    //       total: 1,
    //     },
    //   },
    // ]

    return []
  },
}
