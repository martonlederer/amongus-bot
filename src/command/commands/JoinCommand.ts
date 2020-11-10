import { CommandFunction, MessageType } from '../../types'
import sendMessage from '../../communicator'

const JoinCommand: CommandFunction = async (data, client) => {
  if (!data.guild) return
  if (data.member.voice.channel) {
    const connection = await data.member.voice.channel.join()
    sendMessage('Joined', MessageType.SUCCESS, data.channel, 2000)
  } else {
    sendMessage('You need to join a voice channel first!', MessageType.ERROR, data.channel, 3500)
  }
}

export default JoinCommand
