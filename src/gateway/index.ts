import Fastify from 'fastify'
import { JSONRPCRequest, JSONRPCServer } from 'json-rpc-2.0'
import fs from 'node:fs'
import { logger } from './helper'

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
          logger.info(`Registering method ${m.name}`)
          server.addMethod(m.name, m.execute)
        } else {
          logger.warn(`Error loading method ${method}`)
        }
      })
  }
}

const fastify = Fastify({
  // logger: true,
})
fastify.post('/gatewayApi', (req, reply) => {
  if (req.headers['content-type'] === 'application/x-encrypted') {
    reply.send({ jsonrpc: '2.0', id: null, result: null })
  }

  const jsonRPCRequest = req.body as JSONRPCRequest
  const session = req.headers['x-gatewaysession'] as string | undefined

  const method = jsonRPCRequest.method

  server.receive(jsonRPCRequest, { session }).then((response) => {
    logger.debug(method)
    logger.debug(jsonRPCRequest.params)
    // console.log('res', response?.result)

    if (!response || response.error) {
      logger.error(`Error ${response?.error.message}`)
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
