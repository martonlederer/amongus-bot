import { CommandFunction, MessageType, IQueueMap } from '../../types'
import sendMessage from '../../communicator'
import ytdl from 'ytdl-core-discord'
import { StreamDispatcher, TextChannel, VoiceConnection, MessageEmbed } from 'discord.js'
import isUrl from 'is-url'
import axios from 'axios'
import process from 'process'

let dispatcher: StreamDispatcher
let connection: VoiceConnection
let queue: IQueueMap = {}

export const PlayCommand: CommandFunction = async (args, data, client) => {
  if (!data.guild) return
  if (data.member.voice.channel) {
    if (
      !data.guild.channels.cache.get(data.member.voice.channel.id).members.has(client.user.id) ||
      connection === undefined
    )
      connection = await data.member.voice.channel.join()

    let musicUrl: string
    let name: string

    if (isUrl(args[0])) musicUrl = args[1]
    else
      await axios
        .get(
          `https://www.googleapis.com/youtube/v3/search?q=${escape(
            args.filter((value, i) => i !== 0).join(' ')
          )}&key=${process.env.YOUTUBE}`
        )
        .then((res) => (musicUrl = `https://www.youtube.com/watch?v=${res.data.items[0].id.videoId}`))
        .catch(() => sendMessage('Could not search for video', MessageType.ERROR, data.channel, 4000))

    if (!queue[data.member.guild.id]) queue[data.member.guild.id] = []

    await axios
      .get(
        `https://www.googleapis.com/youtube/v3/videos?id=${
          musicUrl.includes('youtu.be')
            ? musicUrl.split('youtu.be/')[1]
            : new URL(musicUrl).searchParams.get('v')
        }&part=snippet&key=${process.env.YOUTUBE}`
      )
      .then((res) => (name = res.data.items[0].snippet.title ?? musicUrl))
      .catch(() => (name = musicUrl))

    queue[data.member.guild.id].push({ musicUrl, name, channel: data.channel })

    if (queue[data.member.guild.id].length === 1) playNext(data.member.guild.id)
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

export const QueueCommand: CommandFunction = async (args, data, client) => {
  if (!data.guild) return
  if (!data.member.voice.channel || dispatcher === undefined) return
  if (!queue[data.member.guild.id] || queue[data.member.guild.id].length === 0)
    return sendMessage('Nothing on queue', MessageType.ERROR, data.channel, 3000)

  const embed = new MessageEmbed().setTitle('Queue')

  for (const { name } of queue[data.member.guild.id]) {
    embed.fields.push({ name: '', value: name, inline: false })
  }

  await data.channel.send(embed)
}

async function playNext(guildID: string) {
  if (!queue[guildID] || !queue[guildID][0]) return
  const { musicUrl, channel, name } = queue[guildID][0]

  dispatcher = connection.play(await ytdl(musicUrl, { filter: 'audioonly' }), { type: 'opus' })
  queue[guildID] = queue[guildID].filter((value, i) => i !== 0)
  dispatcher.on('finish', () => playNext(guildID))

  sendMessage(`Playing **${name}**`, MessageType.SUCCESS, channel)
}
