import { Readable } from 'node:stream'
import { TDF } from 'tdf.js'
import { logger, logPacket } from './helper'

export enum MessageType {
  MESSAGE = 0,
  REPLY = 1,
  NOTIFICATION = 2,
  ERROR_REPLY = 3,
  PING = 4,
  PING_REPLY = 5,
}

export enum Component {
  Authentication = 1,
  GameManager = 4,
  Redirector = 5,
  Stats = 7,
  Util = 9,
  Messaging = 15,
  AssociationLists = 25,
  GameReporting = 28,
  Inventory = 2051,
  LicenseManager = 2054,
  UserSessions = 30722,
}

export interface PacketHeader {
  payloadSize: number
  metadataSize: number
  component: number
  command: number
  msgNum: number
  msgType: MessageType
  options: number
  reserved: number
}

export class Packet {
  header: PacketHeader
  payload: TDF[] = []

  constructor(header: PacketHeader, payload: TDF[] = []) {
    this.header = header
    this.payload = payload
  }

  encode(msgNum: number) {
    const payload = Buffer.concat(this.payload.map((tdf) => tdf.write()))
    const payloadSize = payload.byteLength - this.header.metadataSize

    this.header.payloadSize = payloadSize
    logPacket(this.header, this.payload)

    const header = Buffer.alloc(16)
    header[0] = (payloadSize >> 24) & 0xff
    header[1] = (payloadSize >> 16) & 0xff
    header[2] = (payloadSize >> 8) & 0xff
    header[3] = (payloadSize >> 0) & 0xff

    header[4] = (this.header.metadataSize >> 8) & 0xff
    header[5] = (this.header.metadataSize >> 0) & 0xff

    header[6] = (this.header.component >> 8) & 0xff
    header[7] = (this.header.component >> 0) & 0xff

    header[8] = (this.header.command >> 8) & 0xff
    header[9] = (this.header.command >> 0) & 0xff

    header[10] = (msgNum >> 16) & 0xff
    header[11] = (msgNum >> 8) & 0xff
    header[12] = (msgNum >> 0) & 0xff

    header[13] = (this.header.msgType << 5) & 0xff

    header[14] = this.header.options & 0xff

    header[15] = this.header.reserved & 0xff

    return Buffer.concat([header, payload])
  }

  static createFromStream(stream: Readable) {
    const buff = stream.read(16)

    const header: PacketHeader = {
      payloadSize: (buff[0] << 24) | (buff[1] << 16) | (buff[2] << 8) | (buff[3] << 0),
      metadataSize: (buff[4] << 8) | (buff[5] << 0),
      component: (buff[6] << 8) | (buff[7] << 0),
      command: (buff[8] << 8) | (buff[9] << 0),
      msgNum: (buff[10] >> 16) | (buff[11] >> 8) | (buff[12] >> 0),
      msgType: buff[13] >> 5,
      options: buff[14],
      reserved: buff[15],
    }

    const payload: TDF[] = []

    
    const shouldBeLeft = stream.readableLength - header.payloadSize
  
    while (stream.readableLength > shouldBeLeft) {  
      const tdf = TDF.readTDF(stream)
      payload.push(tdf)
    }

    if (stream.readableLength != 0) {
      logger.warn('found extra data after payload', stream.readableLength)
    }

    return new Packet(header, payload)
  }
}
