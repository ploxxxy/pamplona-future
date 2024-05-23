import { Socket } from 'node:net'
import {
  TDF,
  TDFBlob,
  TDFDictionary,
  TDFInteger,
  TDFIntVector2,
  TDFIntVector3,
  TDFList,
  TDFString,
  TDFStruct,
  TDFType,
} from 'tdf.js'
import * as Blaze from '../blaze'

export enum Commands {
  sendMessage = 1,
  fetchMessages = 2,
  purgeMessages = 3,
  touchMessages = 4,
  getMessages = 5,
}

export const handleCommand = (
  command: Commands,
  packet: Blaze.Packet,
  socket: Socket
) => {
  switch (command) {
    case Commands.sendMessage:
      console.log('sendMessage', packet.payload)
      // socket.write(sendMessage(0, packet).encode(0))
      socket.write(sendMessage(1, packet).encode(packet.header.msgNum))
      break
    default:
      throw new Error('Unhandled command: ' + command)
  }
}

const sendMessage = (wdyw: number, packet: Blaze.Packet) => {
  const header = {
    payloadSize: 0,
    metadataSize: 0,
    component: Blaze.Component.Messaging,
    command: Commands.sendMessage,
    msgNum: 0,
    msgType: Blaze.MessageType.REPLY,
    options: 0,
    reserved: 0,
  }

  const payload: TDF[] = []

  switch (wdyw) {
    case 0:
      header.msgType = Blaze.MessageType.NOTIFICATION
      payload.push(
        ...[
          new TDFInteger('FLAG', 0),
          new TDFInteger('MGID', 25967391), // TODO: figure out
          new TDFStruct('PYLD', [
            new TDFDictionary('ATTR', TDFType.Integer, TDFType.String, 1, {
              0: '{"id":"6e200b00-9e83-4ce3-9265-4195d236a062","eid":"1011786733","ugcType":"ReachThis"}',
            }),
            new TDFInteger('FLAG', 0),
            new TDFInteger('STAT', 0),
            new TDFInteger('TAG ', 65542),
            new TDFList('TIDS', TDFType.Integer, 1, [1011786733]),
            new TDFIntVector2('TTYP', [30722, 1]),
            new TDFInteger('TYPE', 0),
          ]),
          new TDFIntVector3('SRCE', [30722, 1, 0]),
          new TDFInteger('TIME', Math.floor(Date.now() / 1000)),
          new TDFStruct('USER', [
            new TDFBlob('AVTR', Buffer.alloc(0)),
            new TDFInteger('EXID', 0),
            new TDFInteger('ID  ', 0),
            new TDFString('NAME', 'sneakers'),
            new TDFString('NASP', ''),
          ]),
        ]
      )
      break
    case 1:
      payload.push(new TDFInteger('MGID', 0))
      break
    default:
      break
  }

  return new Blaze.Packet(header, payload)
}
