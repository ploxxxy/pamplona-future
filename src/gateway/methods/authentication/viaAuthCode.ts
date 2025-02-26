import { randomUUID } from 'crypto'

export default {
  name: 'Authentication.viaAuthCode',
  execute(params: { authCode: string }) {
    return {
      sessionId: '00000000-0000-0000-0000-000000000000',
      personaId: '1011786733',
    }
  },
}
