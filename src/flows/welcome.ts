import { join } from 'path'
import { createBot, createProvider, createFlow, addKeyword, utils, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { processCommand, parseStudentData, CommandType, shouldParse } from '../utils/commandInterpreter'
import { validCommands } from '~/utils/commands'
import { defaultWelcome } from './defaultWelcomeFlow'
//import muteLayer from '~/layers/mute.layer'
//import conversationalLayer from '~/layers/conversational.layer'
//import mainLayer from '~/layers/main.layer'

export const welcome = addKeyword<Provider, Database>(EVENTS.WELCOME)
/*    .addAction(muteLayer)
    .addAction(conversationalLayer)
    .addAction(mainLayer)*/
    .addAction(
        async (ctx, { flowDynamic, gotoFlow, endFlow }) => {
            console.log("ENTRO WELCOME")

            console.log(ctx.name)
            console.log(JSON.stringify(ctx))

            console.log('PROCESS COMMAND')
            const responseCommand = await processCommand(ctx.body);
            console.log('LISTANDO COMMAND 1')
            console.log(JSON.stringify(responseCommand))
            handleCommandResponse(responseCommand, flowDynamic, gotoFlow);

            console.log('LISTANDO COMMAND 1')

            if (isDefaultUser(ctx.from)) {
                console.log("Logs holaa default");
                //return gotoFlow(defaultWelcome);
            }


        }
    )


// Función para verificar si el usuario es el default
function isDefaultUser(from: string): boolean {
    return from.includes("51947144701");
}

// Función para manejar la respuesta del comando
async function handleCommandResponse(
    responseCommand: any,
    flowDynamic: any,
    gotoFlow: any
): Promise<void> {
    console.log('LISTANDO COMMAND 1');
    console.log(JSON.stringify(responseCommand));

    switch (responseCommand.type) {
        case CommandType.IGNORE:
            return; // No hacemos nada si el comando es ignorado

        case CommandType.ERROR:
            await flowDynamic(responseCommand.message);
            break;

        default:
            console.log('GO TO FLOW');
            await gotoFlow(responseCommand.flow);
            break;
    }
}
    