import { CommandFunction, MessageType } from '../../types'
import sendMessage from '../../communicator'

const LeaveCommand: CommandFunction = async (data, client) => {
  if (!data.guild) return
  data.guild.voice.channel.leave()
  sendMessage('Left channel.', MessageType.WARNING, data.channel, 2850)
}

export default LeaveCommand
