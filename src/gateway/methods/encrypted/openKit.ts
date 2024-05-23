import { getUserFromSession } from '../..'
import db from '../../../common/prisma'

export default {
  name: 'PamplonaAuthenticated.openKit',
  execute: async (params: { id: string }, session: string) => {

    // FIXME: shit doesnt fucking work

    const personaId = getUserFromSession(session)

    if (!personaId) {
      throw new Error('Invalid session')
    }
    
    const kitId = params.id.toLowerCase()
    
    const result = await db.kitUnlock.upsert({
      where: {
        kitId_userId: {
          kitId,
          userId: personaId,
        },
      },
      create: {
        kitId,
        userId: personaId,
        opened: true,
      },
      update: {
        opened: true,
      },
      include: {
        kit: {
          select: {
            kitType: true
          }
        }
      }
    })

    return {
      id: result.kitId,
      kitType: result.kit.kitType,
      opened: result.opened,
    }
  },
}
