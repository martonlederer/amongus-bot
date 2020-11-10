import { Message } from 'discord.js'

export interface ICommands {
  [key: string]: CommandFunction
}

export enum MessageType {
  ERROR = 'Error',
  SUCCESS = 'Success',
  WARNING = 'Warning',
  INFO = 'Info'
}

export type CommandFunction = (data: Message) => void
