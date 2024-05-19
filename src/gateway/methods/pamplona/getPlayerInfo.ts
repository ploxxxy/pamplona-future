export default {
  name: 'Pamplona.getPlayerInfo',
  execute: (params: { personaId: string }) => {
    
    return {
      name: 'ploxxxxxxy',
      location: [
        {
          type: 'country',
          name: 'Ukraine',
          cc: 'UA',
          id: '690791',
        },
        {
          type: 'locality',
          name: 'Kyiv',
          cc: 'UA',
          id: '703448',
        },
      ],
      division: {
        name: 'Gold',
        rank: 4,
      },
    }
  },
}
