import { TextChannel, DMChannel, NewsChannel, MessageEmbed } from 'discord.js'
import { MessageType } from '../types'

export default async function sendMessage(
  msg: string,
  messageType: MessageType,
  channel: TextChannel | DMChannel | NewsChannel,
  timeout: number
) {
  const embedMessage = new MessageEmbed()
    .setTitle(messageType)
    .setDescription(msg)
    .setColor(
      messageType === MessageType.ERROR
        ? '#ff0000'
        : messageType === MessageType.WARNING
        ? '#fcba03'
        : messageType === MessageType.SUCCESS
        ? '#03fc2c'
        : '#fff'
    )
  const message = await channel.send(embedMessage)

  setTimeout(() => channel.messages.delete(message), timeout)
}
