import db from '../../../common/prisma'

export default {
  name: 'Pamplona.getPlayerInfo',
  execute: async (params: { personaId: number }) => {
    const player = await db.user.findFirst({
      where: {
        personaId: params.personaId.toString(),
      },
    })

    if (!player) {
      return null
    }

    return {
      name: player.name,
      location: [
        // {
        //   type: 'country',
        //   name: 'Ukraine',
        //   cc: 'UA',
        //   id: '690791',
        // },
        // {
        //   type: 'locality',
        //   name: 'Kyiv',
        //   cc: 'UA',
        //   id: '703448',
        // },
      ],
      division: {
        name: player.division,
        rank: player.divisionRank,
      },
    }
  },
}
