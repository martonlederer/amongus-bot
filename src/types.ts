import { Message, Client, TextChannel, DMChannel, NewsChannel } from 'discord.js'

export interface ICommands {
  [key: string]: ICommand
}

export enum MessageType {
  ERROR = 'Error',
  SUCCESS = 'Success',
  WARNING = 'Warning',
  INFO = 'Info'
}

export type CommandFunction = (args: string[], data: Message, client: Client) => void

export interface ICommand {
  command: CommandFunction
  description: string
}

export interface IQueueMap {
  [key: string]: IQueItem[]
}

export interface IQueItem {
  musicUrl: string
  name: string
  channel: TextChannel | DMChannel | NewsChannel // the channel the command is called from
}
