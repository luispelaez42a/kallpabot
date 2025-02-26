import { join } from 'path'
import { createBot, createProvider, createFlow, addKeyword, utils, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { processCommand, parseStudentData, CommandType, shouldParse } from './utils/commandInterpreter'
import { welcome } from './flows/welcome'
import Interpreter from './services/ai/interpreter'
import { interpretsTransaction, registerMovement, registerMovementPendingDescription } from './flows/registerMovement'
import { idleFlow } from './flows/idle-custom'
import { config } from 'dotenv'
import { media } from './flows/media'
import { defaultWelcome } from './flows/defaultWelcomeFlow'
import { listCommands } from './utils/commands'
config()
const ai = new Interpreter(process.env.AI_KEY, 'gemini-2.0-pro-exp-02-05')
const PORT = process.env.PORT
const main = async () => {
    const adapterFlow = createFlow([welcome, listCommands, registerMovement, interpretsTransaction,
                                     idleFlow, media, defaultWelcome, registerMovementPendingDescription])
    
    const adapterProvider = createProvider(Provider ,{
        writeMyself: 'host'
    })
    const adapterDB = new Database()

    const { handleCtx, httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    }, { extensions: { ai } })

    adapterProvider.server.post(
        '/v1/messages',
        handleCtx(async (bot, req, res) => {
            const { number, message, urlMedia } = req.body
            await bot.sendMessage(number, message, { media: urlMedia ?? null })
            return res.end('sended')
        })
    )

    adapterProvider.server.post(
        '/v1/register',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('REGISTER_FLOW', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/samples',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('SAMPLES', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/blacklist',
        handleCtx(async (bot, req, res) => {
            const { number, intent } = req.body
            if (intent === 'remove') bot.blacklist.remove(number)
            if (intent === 'add') bot.blacklist.add(number)

            res.writeHead(200, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ status: 'ok', number, intent }))
        })
    )

    httpServer(+PORT)
}

main()
