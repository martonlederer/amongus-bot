import { CommandFunction } from '../../types'
import { commands } from '../CommandManager'
import { MessageEmbed } from 'discord.js'
import { readFileSync } from 'fs'
import { join } from 'path'

const HelpCommand: CommandFunction = async (data, client) => {
  const pkg = JSON.parse(new TextDecoder().decode(readFileSync(join(__dirname, '../../../package.json'))))
  const embed = new MessageEmbed().setTitle('Help').setFooter(`v${pkg.version}`)

  for (const command in commands) {
    embed.fields.push({ name: command, value: commands[command].description, inline: false })
  }
  await data.channel.send(embed)
}

export default HelpCommand
