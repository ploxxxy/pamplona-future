import Fastify from 'fastify'
import { JSONRPCRequest, JSONRPCServer } from 'json-rpc-2.0'
import fs from 'node:fs'
import {
  chunkStringFixed,
  logger,
  monkeyStringify,
  serializeFloat,
} from './helper'

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

  // if (
  //   method === 'PamplonaAuthenticated.getInitialGameData' &&
  //   jsonRPCRequest.params.levelIds[0] << 0 === -1940918635
  // ) {
  //   reply.header('Content-Type', 'application/json;charset=utf-8')
  //   return reply.send(chunkStringFixed(sex(jsonRPCRequest.id)))
  // }

  server.receive(jsonRPCRequest, { session }).then((response) => {
    logger.debug(method)
    logger.debug(jsonRPCRequest.params)
    // console.log('res', response?.result)

    if (!response || response.error) {
      logger.error(`Error ${response?.error.message}`)
    }

    // TODO: stringify using fast-json-stringify
    // TODO: make similar requests into one thing (getOverview ... getLeaderboard, etc)
    // TODO: create util functions, eg:
    //                  getPlayerInfo + getPlayerInventory = getIntiialGameData

    // return reply.send(response)

    reply.raw.setHeader('Connection', 'close')
    reply.raw.setHeader('Access-Control-Allow-Origin', '*')
    reply.raw.setHeader('Content-Type', 'application/json;charset=utf-8')

    if (!response) {
      return reply.send(
        chunkStringFixed(
          monkeyStringify({ jsonrpc: '2.0', id: null, result: null })
        )
      )
    }

    return reply.send(chunkStringFixed(monkeyStringify(response)))
  })
})

fastify.options('/gatewayApi', (req, reply) => {
  reply.header('Access-Control-Allow-Origin', '*')
  reply.header('Access-Control-Allow-Methods', 'POST')
  reply.header('Access-Control-Allow-Headers', 'Content-Type, X-GatewaySession')
  reply.send()
})

try {
  fastify.listen({ port: 3000, host: '0.0.0.0' })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}

export function getUserFromSession(sessionId: string) {
  return '1011786733'
}
