import db from '../../../common/prisma'

export default {
  name: 'Pamplona.getPlayerTags',
  execute: async (params: { personaIds: number[] }) => {
    const stringifiedPersonaIds = params.personaIds.map((personaId) =>
      personaId.toString()
    )

    const users = await db.user.findMany({
      where: {
        personaId: {
          in: stringifiedPersonaIds,
        },
      },
      include: {
        tagData: true,
      },
    })

    const result = users.map((user) => ({
      personaId: user.personaId,
      // TODO: replace with fallback tag if doesnt exist
      tagData: {
        frame: {
          tag: user.tagData?.frame,
        },
        bg: {
          tag: user.tagData?.bg,
        },
        detail: {
          tag: user.tagData?.detail,
        },
      },
    }))

    return result
  },
}
