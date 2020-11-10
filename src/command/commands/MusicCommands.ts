import { CommandFunction, MessageType } from '../../types'
import sendMessage from '../../communicator'
import ytdl from 'ytdl-core-discord'
import { StreamDispatcher, VoiceConnection } from 'discord.js'

let dispatcher: StreamDispatcher
let connection: VoiceConnection

export const PlayCommand: CommandFunction = async (args, data, client) => {
  if (!data.guild) return
  if (data.member.voice.channel) {
    if (
      !data.guild.channels.cache.get(data.member.voice.channel.id).members.has(client.user.id) ||
      connection === undefined
    )
      connection = await data.member.voice.channel.join()

    dispatcher = connection.play(await ytdl(args[1], { filter: 'audioonly' }), { type: 'opus' })
    sendMessage('Playing ', MessageType.SUCCESS, data.channel, 2000)
  } else {
    sendMessage('You need to join a voice channel first!', MessageType.ERROR, data.channel, 3500)
  }
}

export const StopCommand: CommandFunction = async (args, data, client) => {
  if (!data.guild) return
  if (!data.member.voice.channel || dispatcher === undefined) return
  dispatcher.pause()
  sendMessage('Stopped song', MessageType.WARNING, data.channel, 3500)
}

export const ResumeCommand: CommandFunction = async (args, data, client) => {
  if (!data.guild) return
  if (data.member.voice.channel && dispatcher !== undefined) dispatcher.resume()
}
