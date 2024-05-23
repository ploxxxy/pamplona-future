export default {
  name: 'PamplonaAuthenticated.revokeKit',
  execute: (params: { id: string }, session: string) => {

    console.log('revoke kit', params.id)
    
    return null
  },
}
