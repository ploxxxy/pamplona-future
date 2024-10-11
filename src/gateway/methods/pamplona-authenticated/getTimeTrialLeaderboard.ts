import { getUserFromSession } from '../..'

export default {
  name: 'PamplonaAuthenticated.getTimeTrialLeaderboard',
  execute: async (
    params: {
      offset: number
      count: number
      ugcId: {
        id: string
        userId: number
      }
    },
    session: string
  ) => {
    const personaId = getUserFromSession(session)

    if (!personaId) {
      throw new Error('Invalid session')
    }

    throw new Error('Not implemented')
  },
}
