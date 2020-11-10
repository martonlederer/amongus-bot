import { Client } from 'discord.js'
import process from 'process'
import * as dotenv from 'dotenv'
import { command } from './command/CommandManager'

dotenv.config()

const client = new Client()

client.on('ready', () => {
  console.log(`Started bot. Tag ${client.user.tag}`)  
})

client.on('message', msg => {
  if(msg.author.tag === client.user.tag) return
  if(!msg.content.startsWith('?')) return
  command(msg.content.replace(/^\?/, ''), msg)
})

client.login(process.env.TOKEN)