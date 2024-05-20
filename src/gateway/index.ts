import Fastify from 'fastify'
import { JSONRPCRequest, JSONRPCServer } from 'json-rpc-2.0'
import { randomUUID } from 'node:crypto'
import fs from 'node:fs'
import { inspect } from 'node:util'

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

// fastify.all('/*', (req, reply) => {
//   console.log(req)
// })

fastify.post('/gatewayApi', (req, reply) => {
  if (req.headers['content-type'] === 'application/x-encrypted') {
    reply.send({ jsonrpc: '2.0', id: randomUUID(), result: null })
  }

  const jsonRPCRequest = req.body as JSONRPCRequest
  const session = req.headers['x-gatewaysession'] as string | undefined

  const method = jsonRPCRequest.method

  server.receive(jsonRPCRequest, { session }).then((response) => {
    console.log(method)
    // console.log('req', jsonRPCRequest.params)
    // console.log('res', response?.result)

    if (!response || response.error) {
      console.error('Error', response?.error)
    }

    return reply.send(response)
  })
})

try {
  fastify.listen({ port: 3000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}

export function getUserFromSession(sessionId: string) {
  return '1011786733'
}
