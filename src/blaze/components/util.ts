import {
  TDF,
  TDFDictionary,
  TDFInteger,
  TDFList,
  TDFString,
  TDFStruct,
  TDFType,
} from 'tdf.js'
import { Socket } from 'node:net'
import * as Blaze from '../blaze'
import * as UserSessions from './user-sessions'

export enum Commands {
  fetchClientConfig = 1,
  ping = 2,
  setClientData = 3,
  localizeStrings = 4,
  getTelemetryServer = 5,
  getTickerServer = 6,
  preAuth = 7,
  postAuth = 8,
  userSettingsLoad = 10,
  userSettingsSave = 11,
  userSettingsLoadAll = 12,
  deleteUserSettings = 14,
  userSettingsLoadMultiple = 15,
  filterForProfanity = 20,
  fetchQosConfig = 21,
  setClientMetrics = 22,
  setConnectionState = 23,
  getUserOptions = 25,
  setUserOptions = 26,
  suspendUserPing = 27,
  setClientState = 28,
}

export const handleCommand = (
  command: Commands,
  packet: Blaze.Packet,
  socket: Socket
) => {
  switch (command) {
    case Commands.preAuth:
      socket.write(preAuth().encode(packet.header.msgNum))
      break
    case Commands.ping:
      socket.write(ping().encode(packet.header.msgNum))
      break
    case Commands.fetchClientConfig:
      socket.write(
        fetchClientConfig(packet.payload[0].value as string).encode(
          packet.header.msgNum
        )
      )
      break
    case Commands.postAuth:
      socket.write(UserSessions.updateExtendedDataAttribute().encode(0))
      socket.write(postAuth().encode(packet.header.msgNum))
      socket.write(UserSessions.userSessionExtendedData().encode(0))
      break
    case Commands.setClientMetrics:
      socket.write(setClientMetrics().encode(packet.header.msgNum))
      break
    case Commands.setClientState:
      socket.write(setClientState().encode(packet.header.msgNum))
      break
    default:
      throw new Error('Unhandled command: ' + command)
  }
}

export const fetchClientConfig = (value: string) => {
  const header = {
    payloadSize: 642,
    metadataSize: 0,
    component: Blaze.Component.Util,
    command: Commands.fetchClientConfig,
    msgNum: 0,
    msgType: Blaze.MessageType.REPLY,
    options: 0,
    reserved: 0,
  }

  const payload: TDF[] = []
  switch (value) {
    case 'IdentityParams':
      header.payloadSize = 74

      payload.push(
        new TDFDictionary('CONF', TDFType.String, TDFType.String, 2, {
          display: 'console2/welcome',
          redirect_uri: 'http://127.0.0.1/success',
        })
      )
      break
    case 'PamplonaEndpoints':
      payload.push(
        new TDFDictionary('CONF', TDFType.String, TDFType.String, 12, {
          bugSentryDisableCrashDumpCollection: 'true',
          bugSentryDisableGpuHangReports: 'true',
          engagementManagerApiEndpointUrlBase:
            'http://localhost:4000/engagementManager',
          engagementManagerClientId: 'mirrorsedgecatalyst',
          gatewayApiEndpointUrl: 'http://localhost:3000/gatewayApi',
          gatewayClientId: 'pamplona-backend-as-user-pc',
          gatewayUploadEndpointUrl: 'http://localhost:3000/gatewayUpload',
          messageManagerFetchMessagesIntervalTime: '300.0',
          messageManagerTransientMessagesToFollowers: 'false',
          npsWebUrlBase: 'http://localhost:3000/npsWeb',
          presenceUpdatePositionInterval: '10.0',
          telemetryProjectId: '308903',
        })
      )
      break
  }

  return new Blaze.Packet(header, payload)
}

export const ping = () => {
  const header = {
    payloadSize: 9,
    metadataSize: 0,
    component: Blaze.Component.Util,
    command: Commands.ping,
    msgNum: 0,
    msgType: Blaze.MessageType.REPLY,
    options: 0,
    reserved: 0,
  }

  const payload: TDF[] = [new TDFInteger('TIME', Math.round(Date.now() / 1000))]

  return new Blaze.Packet(header, payload)
}

export const preAuth = () => {
  const header = {
    payloadSize: 1357,
    metadataSize: 0,
    component: Blaze.Component.Util,
    command: Commands.preAuth,
    msgNum: 0,
    msgType: Blaze.MessageType.REPLY,
    options: 0,
    reserved: 0,
  }

  const payload: TDF[] = [
    new TDFString('ASRC', '308903'),
    new TDFList(
      'CIDS',
      TDFType.Integer,
      20,
      [
        30728, 24, 1, 30729, 25, 30730, 27, 9, 10, 33, 63490, 15, 30720, 30722,
        30723, 30724, 21, 30726, 2000, 30727,
      ]
    ),
    new TDFString('CLID', 'MirrorsEdgeCatalyst-SERVER-PC'),
    new TDFStruct('CONF', [
      new TDFDictionary('CONF', TDFType.String, TDFType.String, 17, {
        associationListSkipInitialSet: '1',
        autoReconnectEnabled: '0',
        bytevaultHostname: 'bytevault.gameservices.ea.com',
        bytevaultPort: '42210',
        bytevaultSecure: 'true',
        connIdleTimeout: '40s',
        defaultRequestTimeout: '20s',
        nucleusConnect: 'https://accounts.ea.com',
        nucleusConnectTrusted: 'https://accounts2s.ea.com',
        nucleusPortal: 'https://signin.ea.com',
        nucleusProxy: 'https://gateway.ea.com',
        pingPeriod: '20s',
        userManagerMaxCachedUsers: '0',
        voipHeadsetUpdateRate: '1000',
        xblTokenUrn: 'accounts.ea.com',
        xboxOneStringValidationUri: 'client-strings.xboxlive.com',
        xlspConnectionIdleTimeout: '300',
      }),
    ]),
    new TDFString('ESRC', '308903'),
    new TDFString('INST', 'mirrorsedgecatalyst-2016-pc'),
    new TDFInteger('MAID', 1129238128),
    new TDFInteger('MINR', 0),
    new TDFString('NASP', 'cem_ea_id'),
    new TDFString('PILD', ''),
    new TDFString('PLAT', 'pc'),
    new TDFStruct('QOSS', [
      new TDFStruct('BWPS', [
        new TDFString('PSA ', ''),
        new TDFInteger('PSP ', 0),
        new TDFString('SNA ', ''),
      ]),
      new TDFInteger('LNP ', 10),
      // TODO: investigate struct type difference
      new TDFDictionary('LTPS', TDFType.String, TDFType.Struct, 6, {
        'bio-dub': [
          new TDFString('PSA ', 'qos-prod-bio-dub-common-common.gos.ea.com'),
          new TDFInteger('PSP ', 17504),
          new TDFString('SNA ', 'bio-dub-prod'),
        ],
        'bio-iad': [
          new TDFString('PSA ', 'qos-prod-bio-iad-common-common.gos.ea.com'),
          new TDFInteger('PSP ', 17504),
          new TDFString('SNA ', 'bio-iad-prod'),
        ],
        'bio-sjc': [
          new TDFString('PSA ', 'qos-prod-bio-sjc-common-common.gos.ea.com'),
          new TDFInteger('PSP ', 17504),
          new TDFString('SNA ', 'bio-sjc-prod'),
        ],
        'bio-syd': [
          new TDFString('PSA ', 'qos-prod-bio-syd-common-common.gos.ea.com'),
          new TDFInteger('PSP ', 17504),
          new TDFString('SNA ', 'bio-syd-prod'),
        ],
        'm3d-brz': [
          new TDFString('PSA ', 'qos-prod-m3d-brz-common-common.gos.ea.com'),
          new TDFInteger('PSP ', 17504),
          new TDFString('SNA ', 'm3d-brz-prod'),
        ],
        'm3d-nrt': [
          new TDFString('PSA ', 'qos-prod-m3d-nrt-common-common.gos.ea.com'),
          new TDFInteger('PSP ', 17504),
          new TDFString('SNA ', 'm3d-nrt-prod'),
        ],
      }),
      new TDFInteger('SVID', 1161889797),
      new TDFInteger('TIME', 5000000),
    ]),
    new TDFString('RSRC', '308903'),
    new TDFString('SVER', 'Blaze 15.1.1.0.5 (CL# 1893137)\n'),
  ]

  return new Blaze.Packet(header, payload)
}

export const postAuth = () => {
  const header = {
    payloadSize: 413,
    metadataSize: 0,
    component: Blaze.Component.Util,
    command: Commands.postAuth,
    msgNum: 0,
    msgType: Blaze.MessageType.REPLY,
    options: 0,
    reserved: 0,
  }

  const payload: TDF[] = [
    new TDFStruct('TELE', [
      new TDFString('ADRS', 'https://river.data.ea.com'),
      new TDFInteger('ANON', 0),
      new TDFString('DISA', ''),
      new TDFInteger('EDCT', 0),
      new TDFString('FILT', '-UION/****'),
      new TDFInteger('LOC ', 1701729619),
      new TDFInteger('MINR', 0),
      new TDFString('NOOK', 'US,CA,MX'),
      new TDFInteger('PORT', 80),
      new TDFInteger('SDLY', 15000),
      new TDFString('SESS', 'p56Xl1+oOxD'),
      new TDFString(
        'SKEY',
        '^�×�������Џ���������������×�������������̙Ʀٰ�ʑ��ؗ��ɓ��ܹ�ȝ��������Ǯ������������͜������۪Ӕ��' // FIXME: figure this out
      ),
      new TDFInteger('SPCT', 75),
      new TDFString('STIM', 'Default'),
      new TDFString('SVNM', 'telemetry-3-common'),
    ]),
    new TDFStruct('TICK', [
      new TDFString('ADRS', '10.23.15.2'),
      new TDFInteger('PORT', 8999),
      new TDFString(
        'SKEY',
        '1011786733,10.23.15.2:8999,mirrorsedgecatalyst-2016-pc,10,50,50,50,50,0,12'
      ),
    ]),
    new TDFStruct('UROP', [
      new TDFInteger('TMOP', 0),
      new TDFInteger('UID ', 1011786733),
    ]),
  ]

  return new Blaze.Packet(header, payload)
}

const setClientState = () => {
  const header = {
    payloadSize: 0,
    metadataSize: 0,
    component: Blaze.Component.Util,
    command: Commands.setClientState,
    msgNum: 0,
    msgType: Blaze.MessageType.REPLY,
    options: 0,
    reserved: 0,
  }

  const payload: TDF[] = []
  return new Blaze.Packet(header, payload)
}

const setClientMetrics = () => {
  const header = {
    payloadSize: 0,
    metadataSize: 0,
    component: Blaze.Component.Util,
    command: Commands.setClientMetrics,
    msgNum: 0,
    msgType: Blaze.MessageType.REPLY,
    options: 0,
    reserved: 0,
  }

  const payload: TDF[] = []
  return new Blaze.Packet(header, payload)
}
