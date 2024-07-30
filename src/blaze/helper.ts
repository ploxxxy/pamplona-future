import type { PacketHeader } from './blaze'

import pino from 'pino'
import { type TDF } from 'tdf.js'
import { Component } from './blaze'
import { Commands as AssociationListsCommands } from './components/association-lists'
import { Commands as AuthenticationCommands } from './components/authentication'
import { Commands as MessagingCommands } from './components/messaging'
import { Commands as UserSessionsCommands } from './components/user-sessions'
import { Commands as UtilCommands } from './components/util'

export const logger = pino({
  msgPrefix: '[Blaze] ',
  level: 'debug',
})

export const logPacket = (
  header: PacketHeader,
  payload: TDF[],
  incoming: boolean = false
) => {
  let namedComponent = header.component.toString()
  let namedCommand = header.command.toString()

  switch (header.component) {
    case Component.Authentication:
      namedComponent = 'Authentication'
      namedCommand = AuthenticationCommands[header.command]
      break
    case Component.Util:
      namedComponent = 'Util'
      namedCommand = UtilCommands[header.command]
      break
    case Component.UserSessions:
      namedComponent = 'UserSessions'
      namedCommand = UserSessionsCommands[header.command]
      break
    case Component.AssociationLists:
      namedComponent = 'AssociationLists'
      namedCommand = AssociationListsCommands[header.command]
      break
    case Component.Messaging:
      namedComponent = 'Messaging'
      namedCommand = MessagingCommands[header.command]
      break
  }

  if (header.component === 0) return

  logger.debug(
    `${incoming ? 'Received' : 'Sending'} ${namedComponent}.${namedCommand} (${header.payloadSize} bytes)`
  )
  logger.debug(payload)
}
