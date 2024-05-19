import { getUserFromSession } from '../..'
import db from '../../../common/prisma'

export default {
  name: 'PamplonaAuthenticated.updatePersonaStats',
  execute: async (
    params: { stats: { [key: string]: number } },
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

    await db.$transaction(
      Object.entries(params.stats).map(([flag, value]) => {
        return db.userStats.upsert({
          where: { userId_flag: { userId: '1011786733', flag } },
          create: { userId: '1011786733', flag, value },
          update: { value },
        })
      })
    )

    return {
      success: true,
    }
  },
}
