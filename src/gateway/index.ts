import Fastify from 'fastify'
import { JSONRPCRequest, JSONRPCServer } from 'json-rpc-2.0'
import fs from 'node:fs'

export interface ServerParams {
  session: string | undefined
}
const server = new JSONRPCServer<ServerParams>()

const folders = fs.readdirSync(__dirname + '/methods')
for (const folder of folders) {
  const methods = fs.readdirSync(__dirname + '/methods/' + folder)

  for (const method of methods) {
    import('./methods/' + folder + '/' + method)
      .then((m) => m.default)
      .then((m) => {
        if ('name' in m && 'execute' in m) {
          console.log('Registering method', m.name)
          server.addMethod(m.name, m.execute)
        } else {
          console.error(`Error loading method ${method}`)
        }
      })
  }
}

const fastify = Fastify({
  // logger: true,
})

// fastify.addContentTypeParser(
//   'application/x-encrypted',
//   { parseAs: 'buffer' },
//   (req, body, done) => {

//     done(null, body)
//   }
//   // this does nothing
// )

const ignoreList = [
  'PamplonaAuthenticated.grantKit',
  'PamplonaAuthenticated.updatePersonaStats',
]

fastify.post('/gatewayApi', (req, reply) => {
  const jsonRPCRequest = req.body as JSONRPCRequest
  const session = req.headers['x-gatewaysession'] as string | undefined

  const method = jsonRPCRequest.method

  if (!ignoreList.includes(method)) {
    console.log(method)
  }

  server.receive(jsonRPCRequest, { session }).then((response) => {
    if (response) {
      console.log('res', response)
      return reply.send(response)
    } else {
      console.log('something went wrong', method)
      return reply.send('')
    }
  })
})

try {
  fastify.listen({ port: 3000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}

export function getOnlineUser(sessionId: string) {
  return '1011786733'
}