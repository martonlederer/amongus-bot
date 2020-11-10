import type { Message } from 'discord.js'
import type { ICommands } from '../types'
import { MessageType } from '../types'
import sendMessage from '../communicator'
import { Client } from 'discord.js'

import JoinCommand from './commands/JoinCommand'
import LeaveCommand from './commands/LeaveCommand'

export function command(cmd: string, data: Message, client: Client) {
  if (commands[cmd] === undefined)
    return sendMessage('Invalid command!', MessageType.ERROR, data.channel, 3700)
  commands[cmd](data, client)
}

const commands: ICommands = {
  join: JoinCommand,
  leave: LeaveCommand
}
