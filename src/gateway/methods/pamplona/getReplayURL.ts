export default {
  name: 'Pamplona.getReplayURL',
  execute: async (params: { ugcId: { id: string; userId: number } }) => {
    return {
      url: null,
      playerGhost: {
        personaId: '1011786733',
        ghostData: {
          customization: {
            variation: '3769053394',
          },
          timestamp: {
            timestampValue: '1698065868',
          },
        },
      },
    }
  },
}
