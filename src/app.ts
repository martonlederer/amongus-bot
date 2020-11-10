import { Client } from 'discord.js'
import process from 'process'
import * as dotenv from 'dotenv'
import { command } from './command/CommandManager'
import { readFileSync } from 'fs'
import { join } from 'path'

dotenv.config()

const client = new Client(),
  config = JSON.parse(new TextDecoder().decode(readFileSync(join(__dirname, '../config.json'))))

client.on('ready', () => {
  console.log(`Started bot. Tag: ${client.user.tag}`)
})

client.on('message', (msg) => {
  if (msg.author.tag === client.user.tag) return
  if (!msg.content.startsWith(config.prefix)) return
  command(msg.content.replace(new RegExp('^\\' + config.prefix), ''), msg, client)
})

client.login(process.env.TOKEN)
