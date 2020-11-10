import { Message, Client } from 'discord.js'

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
