import { join } from 'path'
import { createBot, createProvider, createFlow, addKeyword, utils, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { processCommand, parseStudentData, CommandType, shouldParse } from '../utils/commandInterpreter'
import { validCommands } from '~/utils/commands'
import { listStudents } from './listStudents'

export const welcome = addKeyword<Provider, Database>(EVENTS.WELCOME)
    .addAction(
        async (ctx, { flowDynamic, gotoFlow }) => {
            console.log(ctx.name)
            console.log('PROCESS COMMAND')

            const responseCommand = await processCommand(ctx.body) 
            console.log('LISTANDO COMMAND 1')
            console.log(JSON.stringify(responseCommand))

            if(responseCommand.type == CommandType.IGNORE)
                return;

            if(responseCommand.type == CommandType.ERROR)
                return flowDynamic(responseCommand.message)
        
            console.log('GO TO FLOW')

            return gotoFlow(responseCommand.flow)
        }
    )