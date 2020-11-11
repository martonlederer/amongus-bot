import type { Message } from 'discord.js'
import type { ICommands } from '../types'
import { MessageType } from '../types'
import sendMessage from '../communicator'
import { Client } from 'discord.js'

import JoinCommand from './commands/JoinCommand'
import LeaveCommand from './commands/LeaveCommand'
import HelpCommand from './commands/HelpCommand'
import { PlayCommand, StopCommand, ResumeCommand, QueueCommand } from './commands/MusicCommands'

export function command(cmd: string, data: Message, client: Client) {
  if (commands[cmd.split(' ')[0]] === undefined)
    return sendMessage(
      'Invalid command! Type !help for the list of commands.',
      MessageType.ERROR,
      data.channel,
      3700
    )
  commands[cmd.split(' ')[0]].command(cmd.split(' '), data, client)
}

export const commands: ICommands = {
  join: {
    command: JoinCommand,
    description: 'Join the bot to a voice channel'
  },
  leave: {
    command: LeaveCommand,
    description: 'Leave the bot from a voice channel'
  },
  help: {
    command: HelpCommand,
    description: 'Get the commands list'
  },
  play: {
    command: PlayCommand,
    description: 'Play something from YouTube'
  },
  stop: {
    command: StopCommand,
    description: 'Pause the current song'
  },
  resume: {
    command: ResumeCommand,
    description: 'Continue playing the current song'
  },
  queue: {
    command: QueueCommand,
    description: 'Show queue list'
  }
}
