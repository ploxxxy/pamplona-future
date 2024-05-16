import {
  TDF,
  TDFBlob,
  TDFDictionary,
  TDFIntVector3,
  TDFInteger,
  TDFIntegerList,
  TDFList,
  TDFString,
  TDFStruct,
  TDFType,
  TDFUnion,
} from 'tdf.js'
import { Socket } from 'node:net'
import * as Blaze from '../blaze'

export enum Commands {
  validateSessionKey = 1,
  userSessionExtendedData = 2,
  fetchExtendedData = 3,
  updateExtendedDataAttribute = 5,
  updateHardwareFlags = 8,
  lookupUser = 12,
  lookupUsers = 13,
  lookupUsersByPrefix = 14,
  lookupUsersIdentification = 15,
  updateNetworkInfo = 20,
  lookupUserGeoIPData = 23,
  overrideUserGeoIPData = 24,
  updateUserSessionClientData = 25,
  setUserInfoAttribute = 26,
  resetUserGeoIPData = 27,
  lookupUserSessionId = 32,
  fetchLastLocaleUsedAndAuthError = 33,
  fetchUserFirstLastAuthTime = 34,
  setUserGeoOptIn = 37,
  enableUserAuditLogging = 41,
  disableUserAuditLogging = 42,
  getUniqueDeviceId = 45,
  lookupUsersByPrefixMultiNamespace = 47,
  lookupUsersByPersonaNameMultiNamespace = 48,
  lookupUsersByPersonaNamesMultiNamespace = 49,
  lookupUsersByPersonaNames = 50,
  forceOwnSessionLogout = 54,
  updateLocalUserGroup = 55,
}

export const handleCommand = (
  command: Commands,
  packet: Blaze.Packet,
  socket: Socket
) => {
  switch (command) {
    case Commands.updateHardwareFlags:
      socket.write(updateHardwareFlags().encode(packet.header.msgNum))
      break
    case Commands.updateNetworkInfo:
      socket.write(updateNetworkInfo().encode(packet.header.msgNum))
      socket.write(validateSessionKey().encode(0))
      break
    default:
      throw new Error('Unhandled command: ' + command)
  }
}

export const userSessionExtendedData = () => {
  const header = {
    payloadSize: 202,
    metadataSize: 0,
    component: Blaze.Component.UserSessions,
    command: Commands.userSessionExtendedData,
    msgNum: 0,
    msgType: Blaze.MessageType.NOTIFICATION,
    options: 0,
    reserved: 0,
  }

  const payload: TDF[] = [
    new TDFStruct('DATA', [
      new TDFUnion('ADDR', 127, new TDFString('BPS ', '')),
      new TDFString('CTY ', ''),
      new TDFIntegerList('CVAR', []),
    ]),
    new TDFDictionary('DMAP', 0, 0, 1, {
      '2013396993': 0,
    }),
    new TDFInteger('HWFG', 0),
    new TDFString('ISP ', ''),
    new TDFStruct('QDAT', [
      new TDFInteger('BWHR', 0),
      new TDFInteger('DBPS', 0),
      new TDFInteger('NAHR', 0),
      new TDFInteger('NATT', 0),
      new TDFInteger('UBPS', 0),
    ]),
    new TDFString('TZ  ', ''),
    new TDFInteger('UATT', 0),
    new TDFList('ULST', 9, 1, [[30722, 2, 88123840]]),
    new TDFStruct('USER', [
      new TDFInteger('AID ', 2407107883),
      new TDFInteger('ALOC', 1920292161),
      new TDFBlob('EXBB', Buffer.alloc(0)),
      new TDFInteger('EXID', 2407107883),
      new TDFInteger('ID  ', 1011786733),
      new TDFString('NAME', 'ploxxxxxxy'),
      new TDFString('NASP', 'cem_ea_id'),
      new TDFInteger('ORIG', 1011786733),
      new TDFInteger('PIDI', 0),
    ]),
  ]

  return new Blaze.Packet(header, payload)
}

export const updateHardwareFlags = () => {
  const header = {
    payloadSize: 216,
    metadataSize: 0,
    component: Blaze.Component.UserSessions,
    command: Commands.updateHardwareFlags,
    msgNum: 0,
    msgType: Blaze.MessageType.NOTIFICATION,
    options: 1,
    reserved: 0,
  }

  const payload: TDF[] = [
    new TDFInteger('1CON', 0),
    new TDFInteger('ALOC', 1920292161),
    new TDFInteger('BUID', 1011786733),
    new TDFIntVector3('CGID', [30722, 2, 88123840]),
    new TDFString('DSNM', 'ploxxxxxxy'),
    new TDFInteger('FRST', 0),
    new TDFString(
      'KEY ',
      '0540000031e5dde8_wT9NlhYTUidv3EMiZo7kaRMYV0x3$x72YrtOC*QU1v'
    ),
    new TDFInteger('LAST', 1700769152),
    new TDFInteger('LLOG', 1700769258),
    new TDFString('MAIL', '******@ukr.net'),
    new TDFString('NASP', 'cem_ea_id'),
    new TDFInteger('PID ', 1011786733),
    new TDFInteger('PLAT', 4),
    new TDFInteger('UID ', 2407107883),
    new TDFInteger('USTP', 0),
    new TDFInteger('XREF', 2407107883),
  ]

  return new Blaze.Packet(header, payload)
}

export const updateExtendedDataAttribute = () => {
  const header = {
    payloadSize: 14,
    metadataSize: 0,
    component: Blaze.Component.UserSessions,
    command: Commands.updateExtendedDataAttribute,
    msgNum: 0,
    msgType: Blaze.MessageType.NOTIFICATION,
    options: 0,
    reserved: 0,
  }

  const payload: TDF[] = [
    new TDFInteger('FLGS', 3),
    new TDFInteger('ID  ', 1011786733),
  ]

  return new Blaze.Packet(header, payload)
}

const updateNetworkInfo = () => {
  const header = {
    payloadSize: 0,
    metadataSize: 0,
    component: Blaze.Component.UserSessions,
    command: Commands.updateNetworkInfo,
    msgNum: 0,
    msgType: Blaze.MessageType.REPLY,
    options: 0,
    reserved: 0,
  }

  const payload: TDF[] = []
  return new Blaze.Packet(header, payload)
}

const validateSessionKey = () => {
  const header = {
    payloadSize: 190,
    metadataSize: 0,
    component: Blaze.Component.UserSessions,
    command: Commands.validateSessionKey,
    msgNum: 0,
    msgType: Blaze.MessageType.NOTIFICATION,
    options: 0,
    reserved: 0,
  }

  const payload: TDF[] = [
    new TDFStruct('DATA', [
      new TDFUnion(
        'ADDR',
        0x02,
        new TDFStruct('VALU', [
          new TDFStruct('EXIP', [
            new TDFInteger('IP  ', 2960127744),
            new TDFInteger('MACI', 0),
            new TDFInteger('PORT', 3659),
          ]),
          new TDFStruct('INIP', [
            new TDFInteger('IP  ', 3232235838),
            new TDFInteger('MACI', 0),
            new TDFInteger('PORT', 3659),
          ]),
          new TDFInteger('MACI', 1129238128),
        ])
      ),
      new TDFString('BPS ', ''),
      new TDFString('CTY ', ''),
      new TDFIntegerList('CVAR', []),
      new TDFDictionary('DMAP', TDFType.Integer, TDFType.Integer, 1, {
        2013396993: 0,
      }),
      new TDFInteger('HWFG', 0),
      new TDFString('ISP ', ''),
      new TDFStruct('QDAT', [
        new TDFInteger('BWHR', 0),
        new TDFInteger('DBPS', 0),
        new TDFInteger('NAHR', 0),
        new TDFInteger('NATT', 0),
        new TDFInteger('UBPS', 0),
      ]),
      new TDFString('TZ  ', ''),
      new TDFInteger('UATT', 0),
      new TDFList('ULST', TDFType.IntVector3, 1, [[30722, 2, 88123840]]),
    ]),
    new TDFInteger('SUBS', 1),
    new TDFInteger('USID', 1011786733),
  ]

  return new Blaze.Packet(header, payload)
}
