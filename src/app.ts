import { join } from 'path'
import { createBot, createProvider, createFlow, addKeyword, utils, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { processCommand, parseStudentData, CommandType, shouldParse } from './utils/commandInterpreter'
import { saveStudent, getStudents } from "src/services/Students";
import { welcome } from './flows/welcome'
import { listStudents } from './flows/listStudents'
import { listCommands } from './flows/listCommands'
import { registerStudent } from './flows/registerStudent'
import Interpreter from './services/ai/interpreter'
import { interpretsTransaction, registerMovement } from './flows/registerMovement'
import { idleFlow } from './flows/idle-custom'
import { config } from 'dotenv'
config()
const ai = new Interpreter(process.env.AI_KEY, 'gemini-1.5-flash')
const PORT = process.env.PORT

const main = async () => {
    const adapterFlow = createFlow([welcome, listStudents, listCommands, registerStudent, registerMovement, interpretsTransaction, idleFlow])
    
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
