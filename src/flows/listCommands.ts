import { createBot, createProvider, createFlow, addKeyword, utils, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { validCommands } from '~/utils/commands';

export const listCommands = addKeyword<Provider, Database>(utils.setEvent('GET_COMMANDS'))
.addAction(async (_, { flowDynamic, state }) => {
   return await flowDynamic(`Comandos disponibles:\n *${Object.keys(validCommands).join('* \n *')}*`)
})