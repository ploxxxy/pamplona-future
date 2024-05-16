import net from 'node:net'
import { Readable } from 'node:stream'
import * as Blaze from './blaze'
import * as AssociationLists from './components/association-lists'
import * as Authentication from './components/authentication'
import * as UserSessions from './components/user-sessions'
import * as Util from './components/util'
import './redirector'
import chalk from 'chalk'
import { logPacket } from './helper'

const server = net.createServer((socket) => {
  // socket.setTimeout(600)

  socket.on('data', (data) => {
    // setTimeout(() => {
    try {
      const readable = new Readable({ read() {} })
      readable.push(data)
      readable.push(null)

      const packet = Blaze.Packet.createFromStream(readable)
      handleIncomingPacket(packet, socket)
    } catch (error) {
      console.log(chalk.bgRedBright('[Blaze] ERROR'), error)
      
      console.log({
        payloadSize:
          (data[0] << 24) | (data[1] << 16) | (data[2] << 8) | (data[3] << 0),
        metadataSize: (data[4] << 8) | (data[5] << 0),
        component: (data[6] << 8) | (data[7] << 0),
        command: (data[8] << 8) | (data[9] << 0),
        msgNum: (data[10] >> 16) | (data[11] >> 8) | (data[12] >> 0),
        msgType: data[13] >> 5,
        options: data[14],
        reserved: data[15],
      })

      console.log(data.toString('hex').match(/../g)?.join(' '))
    }
    // }, 5000)
  })

  socket.on('end', () => {
    console.log('[Server] Connection closed')
  })

  socket.on('error', (error) => {
    console.log(chalk.bgRedBright('[Server] ERROR'), error)
  })

  socket.on('timeout', () => {
    console.log('[Server] Connection timed out')
    socket.destroy()
  })
})

server.on('listening', () => {
  console.log('[Server] Server started')
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
    default:
      throw new Error('Unhandled component: ' + packet.header.component)
  }
}
