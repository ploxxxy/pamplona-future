export default {
  name: 'PamplonaAuthenticated.finishReachThis',
  execute: async (params: { ugcId: { id: string; userId: number } }) => {
    // TODO: Implement
    return {
      meta: null,
      stats: null,
      userStats: { reachedAt: Date.now().toString() },
      userRank: { rank: 1, score: Date.now().toString(), total: 1 },
    }
  },
}
