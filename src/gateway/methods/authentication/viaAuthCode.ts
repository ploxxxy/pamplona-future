export default {
  name: 'Authentication.viaAuthCode',
  execute(params: { authCode: string }) {
    return {
      sessionId: 'new-session-id',
      personaId: '1011786733',
    }
  },
}
