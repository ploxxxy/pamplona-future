import express from 'express'
import { JSONRPCRequest, JSONRPCResponse, JSONRPCServer } from 'json-rpc-2.0'
import fs from 'node:fs'
import { logger } from './helper'

const app = express()

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

function insertFloats(data: JSONRPCResponse | null) {
  const newData = JSON.stringify(data)
    .replace(/("q[x-z]":0),/g, '$1.0,')
    .replace(/("p[f-g]_.*?":\d*)/g, '$1.0')
  return newData
}

app.use(express.json())

app.post('/gatewayApi', (req, res) => {
  if (req.header('content-type') === 'application/x-encrypted') {
    res.send({ jsonrpc: '2.0', id: null, result: null })
  }

  const RPC = req.body as JSONRPCRequest
  const session = req.header('x-gatewaysession') as string | undefined
  const method = RPC.method

  RPC.id = RPC.id?.toString() || null

  server.receive(RPC, { session }).then((response) => {
    logger.debug(method)
    logger.debug(RPC.params)

    if (!response || response.error) {
      logger.error(`Error ${response?.error.message}`)
    }

    res.set('Content-Type', 'application/json')
    res.set('Access-Control-Allow-Origin', '*')

    res.write(insertFloats(response))
    res.end()
  })
})

app.listen(3000)

export function getUserFromSession(sessionId: string) {
  return '1011786733'
}
