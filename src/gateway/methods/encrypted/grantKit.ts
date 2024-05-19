import { getUserFromSession } from '../..'
import db from '../../../common/prisma'

export default {
  name: 'PamplonaAuthenticated.grantKit',
  execute: async (params: { id: string }, session: string) => {
    // have to do a weird conversion because the game uses all caps
    const kitId = params.id.toLowerCase()

    const personaId = getUserFromSession(session)

    if (!personaId) {
      throw new Error('Invalid session')
    }

    const kitExists = await db.kit.findFirst({
      where: {
        id: kitId,
      },
    })

    if (!kitExists) {
      throw new Error('Kit does not exist')
    }

    const kitUnlockExists = await db.kitUnlock.findFirst({
      where: {
        kitId: kitId,
        userId: personaId,
      },
    })

    if (kitUnlockExists) {
      return {
        id: params.id,
        kitType: kitExists.kitType,
        opened: kitUnlockExists.opened,
      }
    }

    await db.kitUnlock.create({
      data: {
        kitId: kitId,
        userId: personaId,
        opened: false,
      },
    })

    return {
      id: params.id,
      kitType: kitExists.kitType,
      opened: false,
    }
  },
}
