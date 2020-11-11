import { CommandFunction, MessageType } from '../../types'
import sendMessage from '../../communicator'
import ytdl from 'ytdl-core-discord'
import { StreamDispatcher, VoiceConnection } from 'discord.js'
import isUrl from 'is-url'
import axios from 'axios'
import process from 'process'

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

    let musicUrl: string

    if (isUrl(args[0])) musicUrl = args[1]
    else
      await axios
        .get(
          `https://www.googleapis.com/youtube/v3/search?q=${escape(
            args.filter((value, i) => i !== 0).join(' ')
          )}&key=${process.env.YOUTUBE}`
        )
        .then(({ data }) => (musicUrl = `https://www.youtube.com/watch?v=${data.items[0].id.videoId}`))
        .catch(() => sendMessage('Could not search for video', MessageType.ERROR, data.channel, 4000))

    dispatcher = connection.play(await ytdl(musicUrl, { filter: 'audioonly' }), { type: 'opus' })

    // TODO
    await axios
      .get(
        `https://www.googleapis.com/youtube/v3/videos?id=${
          musicUrl.includes('youtu.be')
            ? musicUrl.split('youtu.be/')[1]
            : new URL(musicUrl).searchParams.get('v')
        }&part=snippet&key=${process.env.YOUTUBE}`
      )
      .then(({ data }) =>
        sendMessage(`Playing ${data.items[0].snippet.title ?? 'video'}`, MessageType.SUCCESS, data.channel)
      )
      .catch(() => sendMessage(`Playing ${musicUrl}`, MessageType.SUCCESS, data.channel))
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
  if (!data.member.voice.channel || dispatcher === undefined) return
  dispatcher.resume()
  sendMessage('Resuming song', MessageType.WARNING, data.channel, 3500)
}
