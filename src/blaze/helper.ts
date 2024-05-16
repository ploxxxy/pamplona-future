import type { PacketHeader } from './blaze'

import chalk from 'chalk'
import type { TDF } from 'tdf.js'
import { Component } from './blaze'
import { Commands as AssociationListsCommands } from './components/association-lists'
import { Commands as AuthenticationCommands } from './components/authentication'
import { Commands as UserSessionsCommands } from './components/user-sessions'
import { Commands as UtilCommands } from './components/util'

export const logPacket = (
  header: PacketHeader,
  _payload: TDF[],
  incoming: boolean = false
) => {
  const color = incoming ? 'yellowBright' : 'blue'
  const direction = incoming ? '⬇' : '⬆'

  let namedCommand = 'UNKNOWN'

  switch (header.component) {
    case Component.Authentication:
      namedCommand = AuthenticationCommands[header.command]
      break
    case Component.Util:
      namedCommand = UtilCommands[header.command]
      break
    case Component.UserSessions:
      namedCommand = UserSessionsCommands[header.command]
      break
    case Component.AssociationLists:
      namedCommand = AssociationListsCommands[header.command]
      break
  }

  console.log(
    chalk[color](
      direction +
        ` [Blaze] ${incoming ? 'Received' : 'Sending'} ${Component[header.component] ?? header.component}.${namedCommand} (${header.payloadSize} bytes)`
    )
  )
  // console.log(inspect(incoming ? _payload : '\n', false, null, true))
}
