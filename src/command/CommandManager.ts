import type { Message } from 'discord.js'
import type { ICommands } from '../types'
import { MessageType } from '../types'
import sendMessage from '../communicator'

export function command(cmd: string, data: Message) {
  if (commands[cmd] === undefined)
    return sendMessage('Invalid command!', MessageType.ERROR, data.channel, 3700)
  commands[cmd](data)
}

const commands: ICommands = {
  join: (data) => data.channel.send('Join kommand')
}
