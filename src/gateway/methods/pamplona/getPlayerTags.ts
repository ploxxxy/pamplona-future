export default {
  name: 'Pamplona.getPlayerTags',
  execute: async (params: { personaIds: string[] }) => {

    // TODO: replace with db call
    
    return [
      {
        personaId: '1011786733',
        tagData: {
          frame: {
            tag: '742845892',
          },
          bg: {
            tag: '1310589350',
          },
          detail: {
            tag: '1640298601',
          },
        },
      },
    ]
  },
}
