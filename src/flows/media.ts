import { join } from 'path'
import { createBot, createProvider, createFlow, addKeyword, utils, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { processCommand, parseStudentData, CommandType, shouldParse, validateCommand, splitInput } from '../utils/commandInterpreter'
import { MEDIA_COMMAND } from '~/utils/utils'
import { start } from './idle-custom'
import { typing } from '~/utils/presence'

export const media = addKeyword<Provider, Database>(EVENTS.MEDIA)
    .addAction(
        async (ctx, { provider, state, flowDynamic, gotoFlow, endFlow }) => {
            console.log(ctx.name)
            console.log('PROCESS COMMAND MEDIA')

            const to = ctx.name;
            const localPath = await saveMediaFile(provider, ctx);

            if (shouldEndFlow(ctx)) {
                return endFlow();
            }

            start(ctx, gotoFlow, 120)
            await typing(ctx, provider)

            const responseCommand = await processCommand(MEDIA_COMMAND);
            console.log('LISTANDO COMMAND MEDIA')
            console.log(JSON.stringify(responseCommand))
            handleMediaCommandResponse(responseCommand, flowDynamic, gotoFlow, state, to, localPath, ctx);
        }
    )


// Función para registrar información del contexto
function logMediaContext(ctx: any): void {
    console.log(ctx.name);
    console.log('PROCESS COMMAND MEDIA');
}

// Función para guardar el archivo multimedia
async function saveMediaFile(provider: any, ctx: any): Promise<string> {
    return await provider.saveFile(ctx, { path: './assets/' });
}

// Función para verificar si se debe finalizar el flujo
function shouldEndFlow(ctx: any): boolean {
    const [prefix] = splitInput(ctx?.message?.imageMessage?.caption) || [];
    
    return !ctx?.message?.imageMessage?.caption || !validateCommand(prefix);
}

// Función para manejar la respuesta del comando multimedia
async function handleMediaCommandResponse(
    responseCommand: any,
    flowDynamic: any,
    gotoFlow: any,
    state: any,
    username: string,
    localPath: string,
    ctx: any
): Promise<void> {
    console.log('LISTANDO COMMAND MEDIA');
    console.log(JSON.stringify(responseCommand));

    switch (responseCommand.type) {
        case CommandType.IGNORE:
            return;

        case CommandType.ERROR:
            await flowDynamic(responseCommand.message);
            break;

        default:
            console.log('GO TO FLOW MEDIA');
            await state.update({
                username: username,
                localPath: localPath,
                description: ctx?.message?.imageMessage?.caption,
                isMultimedia: true
            });
            await gotoFlow(responseCommand.flow);
            break;
    }
}    