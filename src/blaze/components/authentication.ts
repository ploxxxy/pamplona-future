import { TDF, TDFInteger, TDFList, TDFString, TDFStruct, TDFType } from 'tdf.js'
import { Socket } from 'node:net'
import * as Blaze from '../blaze'
import * as UserSessions from './user-sessions'

export enum Commands {
  login = 10,
  trustedLogin = 11,
  updateAccount = 20,
  upgradeAccount = 21,
  listUserEntitlements2 = 29,
  getAccount = 30,
  grantEntitlement = 31,
  listEntitlements = 32,
  getUseCount = 34,
  decrementUseCount = 35,
  getAuthToken = 36,
  getPasswordRules = 38,
  grantEntitlement2 = 39,
  modifyEntitlement2 = 43,
  consumecode = 44,
  passwordForgot = 45,
  getPrivacyPolicyContent = 47,
  listPersonaEntitlements2 = 48,
  checkAgeReq = 51,
  getOptIn = 52,
  enableOptIn = 53,
  disableOptIn = 54,
  expressLogin = 60,
  logout = 70,
  getPersona = 90,
  listPersonas = 100,
  expressCreateAccount = 101,
  createWalUserSession = 230,
  acceptLegalDocs = 241,
  getEmailOptInSettings = 242,
  getTermsOfServiceContent = 246,
  getOriginPersona = 260,
  checkEmail = 270,
  getPersonaNameSuggestions = 280,
  guestLogin = 290,
}

export const handleCommand = (
  command: Commands,
  packet: Blaze.Packet,
  socket: Socket
) => {
  switch (command) {
    case Commands.login:
      socket.write(login().encode(packet.header.msgNum))
      socket.write(UserSessions.updateHardwareFlags().encode(0)) // OK
      break
    case Commands.listUserEntitlements2:
      socket.write(listUserEntitlements2().encode(packet.header.msgNum))
      break
    default:
      throw new Error('Unhandled command: ' + command)
  }
}

const login = () => {
  const header = {
    payloadSize: 201,
    metadataSize: 75,
    component: Blaze.Component.Authentication,
    command: Commands.login,
    msgNum: 0,
    msgType: Blaze.MessageType.REPLY,
    options: 0,
    reserved: 0,
  }

  const payload: TDF[] = [
    new TDFInteger('CNTX', 0),
    new TDFInteger('ERRC', 0),
    new TDFString(
      'SKEY',
      '0540000031e5dde8_wT9NlhYTUidv3EMiZo7kaRMYV0x3$x72YrtOC*QU1v'
    ),
    new TDFInteger('ANON', 0),
    new TDFInteger('NTOS', 0),
    new TDFStruct('SESS', [
      new TDFInteger('1CON', 0),
      new TDFInteger('BUID', 1011786733),
      new TDFInteger('FRST', 0),
      new TDFString(
        'KEY ',
        '0540000031e5dde8_wT9NlhYTUidv3EMiZo7kaRMYV0x3$x72YrtOC*QU1v'
      ),
      new TDFInteger('LLOG', 1700769352),
      new TDFString('MAIL', '******@ukr.net'),
      new TDFStruct('PDTL', [
        new TDFString('DSNM', 'ploxxxxxxy'),
        new TDFInteger('LAST', 0),
        new TDFInteger('PID ', 1011786733),
        new TDFInteger('PLAT', 4),
        new TDFInteger('STAS', 0),
        new TDFInteger('XREF', 2407107883),
      ]),
      new TDFInteger('UID ', 2407107883),
    ]),
    new TDFInteger('SPAM', 0),
    new TDFInteger('UNDR', 0),
  ]

  return new Blaze.Packet(header, payload)
}

const listUserEntitlements2 = () => {
  const header = {
    payloadSize: 0,
    metadataSize: 0,
    component: Blaze.Component.Authentication,
    command: Commands.listUserEntitlements2,
    msgNum: 0,
    msgType: Blaze.MessageType.REPLY,
    options: 0,
    reserved: 0,
  }

  // TODO: investigate struct type difference (19.tdf)
  const payload: TDF[] = [
    new TDFList('NLST', TDFType.Struct, 4, [
      [
        new TDFString('DEVI', ''),
        new TDFString('GDAY', '2018-02-17T11:38Z'),
        new TDFString('GNAM', 'MirrorsEdgeCatalyst'),
        new TDFInteger('ID  ', 2438693323),
        new TDFInteger('ISCO', 1),
        new TDFInteger('PID ', 0),
        new TDFString('PJID', '314267'),
        new TDFInteger('PRCA', 0),
        new TDFString('PRID', ''),
        new TDFInteger('STAT', 1),
        new TDFInteger('STRC', 0),
        new TDFString('TAG ', 'USED_COMPANION_MOBILE_APP_ANDROID'),
        new TDFString('TDAY', ''),
        new TDFInteger('TYPE', 5),
        new TDFInteger('UCNT', 0),
        new TDFInteger('VER ', 0),
      ],
      [
        new TDFString('DEVI', ''),
        new TDFString('GDAY', '2017-03-20T10:48Z'),
        new TDFString('GNAM', 'MirrorsEdgeCatalyst'),
        new TDFInteger('ID  ', 1883293323),
        new TDFInteger('ISCO', 1),
        new TDFInteger('PID ', 0),
        new TDFString('PJID', '314268'),
        new TDFInteger('PRCA', 0),
        new TDFString('PRID', ''),
        new TDFInteger('STAT', 1),
        new TDFInteger('STRC', 0),
        new TDFString('TAG ', 'USED_COMPANION_MOBILE_APP_WP'),
        new TDFString('TDAY', ''),
        new TDFInteger('TYPE', 5),
        new TDFInteger('UCNT', 0),
        new TDFInteger('VER ', 0),
      ],
      [
        new TDFString('DEVI', ''),
        new TDFString('GDAY', '2017-03-13T6:31Z'),
        new TDFString('GNAM', 'MirrorsEdgeCatalyst'),
        new TDFInteger('ID  ', 1838893323),
        new TDFInteger('ISCO', 1),
        new TDFInteger('PID ', 0),
        new TDFString('PJID', '313497'),
        new TDFInteger('PRCA', 0),
        new TDFString('PRID', ''),
        new TDFInteger('STAT', 1),
        new TDFInteger('STRC', 0),
        new TDFString('TAG ', 'USED_COMPANION_WEBSITE_DESKTOP'),
        new TDFString('TDAY', ''),
        new TDFInteger('TYPE', 5),
        new TDFInteger('UCNT', 0),
        new TDFInteger('VER ', 0),
      ],
      [
        new TDFString('DEVI', ''),
        new TDFString('GDAY', '2016-06-12T14:35Z'),
        new TDFString('GNAM', 'MECATPC'),
        new TDFInteger('ID  ', 345193323),
        new TDFInteger('ISCO', 0),
        new TDFInteger('PID ', 0),
        new TDFString('PJID', '308903'),
        new TDFInteger('PRCA', 2),
        new TDFString('PRID', 'Origin.OFR.50.0001000'),
        new TDFInteger('STAT', 1),
        new TDFInteger('STRC', 0),
        new TDFString('TAG ', 'ONLINE_ACCESS'),
        new TDFString('TDAY', ''),
        new TDFInteger('TYPE', 1),
        new TDFInteger('UCNT', 0),
        new TDFInteger('VER ', 0),
      ],
    ]),
  ]

  return new Blaze.Packet(header, payload)
}
