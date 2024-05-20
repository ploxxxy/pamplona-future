import { randomUUID } from 'crypto'

export default {
  name: 'Authentication.viaAuthCode',
  execute(params: { authCode: string }) {
    return {
      sessionId: randomUUID(),
      personaId: '1011786733',
    }
  },
}
