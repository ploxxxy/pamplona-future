import net from 'node:net'
import { Readable } from 'node:stream'
import * as Blaze from './blaze'
import * as AssociationLists from './components/association-lists'
import * as Authentication from './components/authentication'
import * as Messaging from './components/messaging'
import * as UserSessions from './components/user-sessions'
import * as Util from './components/util'
import { logger, logPacket } from './helper'
import './redirector'

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    try {
      const readable = new Readable({ read() {} })
      readable.push(data)
      readable.push(null)

      const packet = Blaze.Packet.createFromStream(readable)
      handleIncomingPacket(packet, socket)
    } catch (error) {
      logger.error(error)
    }
  })

  socket.on('end', () => {
    logger.info('Connection closed')
  })

  socket.on('error', (error) => {
    logger.error(error)
  })

  socket.on('timeout', () => {
    logger.info('Connection timed out')
    socket.destroy()
  })
})

server.on('listening', () => {
  logger.info('Server started')
})

server.listen(25565, '127.0.0.1')

const handleIncomingPacket = (packet: Blaze.Packet, socket: net.Socket) => {
  logPacket(packet.header, packet.payload, true)

  switch (packet.header.component) {
    case 0:
      socket.write(packet.encode(packet.header.msgNum))
      break
    case Blaze.Component.Util:
      Util.handleCommand(packet.header.command, packet, socket)
      break
    case Blaze.Component.Authentication:
      Authentication.handleCommand(packet.header.command, packet, socket)
      break
    case Blaze.Component.UserSessions:
      UserSessions.handleCommand(packet.header.command, packet, socket)
      break
    case Blaze.Component.AssociationLists:
      AssociationLists.handleCommand(packet.header.command, packet, socket)
      break
    case Blaze.Component.Messaging:
      Messaging.handleCommand(packet.header.command, packet, socket)
      break
    default:
      throw new Error('Unhandled component: ' + packet.header.component)
  }
}
