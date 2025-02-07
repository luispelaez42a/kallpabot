import { join } from 'path'
import { createBot, createProvider, createFlow, addKeyword, utils, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { processCommand, parseStudentData, CommandType, shouldParse } from '../utils/commandInterpreter'
import Interpreter from '~/services/ai/interpreter'
import { saveTransaction } from '~/services/transactions'
import { isImageMimeType, TRANSACTION_MULTIMEDIA_PROMPT, TRANSACTION_TEXT_PROMPT } from '~/utils/utils'
import { reset, start, stop } from './idle-custom'

export const registerMovement = addKeyword<Provider, Database>(utils.setEvent('REGISTER_MOVEMENT'))
.addAction(async (ctx, { gotoFlow }) => start(ctx, gotoFlow, 120))
.addAnswer(`🫡 Ingrese su transacción (Puedes ingresar una foto o un texto) \n 📷 *Si es una foto, esta debe indicar el monto como mínimo* \n 📝 *Si es solo texto debe indicar como mínimo el monto, si es ingreso o egreso y una breve descripción* \n Ejm: *Egreso Pago Profesor Luis S/200*`
    , { capture: true }, async (ctx, { state, provider, flowDynamic, gotoFlow }) => {
    const to = ctx.name
    console.log(ctx.from + " : " + to)
    console.log(JSON.stringify(ctx));
    reset(ctx, gotoFlow, 60)
    if(!isImageMimeType(ctx?.message?.imageMessage?.mimetype)){
        await state.update({ username: to, description: ctx.body })
        return gotoFlow(interpretsTransaction)
    }

    const localPath = await provider.saveFile(ctx, { path: './assets/'})
    //await flowDynamic(localPath)
    console.log('Ruta del archivo de audio local:', localPath)
    console.log(ctx?.message?.imageMessage?.caption)

    if(ctx?.message?.imageMessage?.caption) {
        await state.update({ username: to, localPath: localPath, description: ctx?.message?.imageMessage?.caption, isMultimedia: true })
        console.log('IMG CON CAPTION')
        return gotoFlow(interpretsTransaction);
    }
    await state.update({ username: to, localPath: localPath })

})
.addAnswer(`Ingrese descripción (*Indicar si es ingreso o egreso*, ejm: *Egreso Pago Profesor Victor*)`, { capture: true }, async (ctx, { state, gotoFlow }) => {
    await state.update({ description: ctx.body })
})
.addAction(async (_, { gotoFlow }) => {
    return gotoFlow(interpretsTransaction);
});


export const interpretsTransaction = addKeyword<Provider, Database>(utils.setEvent('INTERPRETS_TRANSACTION'))
.addAction(async (ctx, { flowDynamic, state, extensions, endFlow }) => {
    stop(ctx);
    const currentState = state.getMyState();
    await flowDynamic(`🫡 Genial ${currentState.username}! Dame unos segundos para entender y registrar tu trx`)
    console.log(JSON.stringify(currentState));
    const responseTrx = await interpreterAndSaveTransaction(ctx, currentState, extensions, currentState.isMultimedia || false)
    console.log(JSON.stringify(responseTrx))
    state.clear();
    return endFlow(`${responseTrx.message}`);
});

const interpreterAndSaveTransaction = async (ctx: any, currentState: any, extensions: any, isMultimedia = false) => {
    const interpreter = extensions.ai as Interpreter
    let response
    
    if(!currentState.localPath)
        response = await interpreter.interprets(TRANSACTION_TEXT_PROMPT.replace(/\{prompt}/g, currentState.description).replace(/\{phone_origin}/g, ctx.from));
    else 
        response = await interpreter.interpretsMultimedia(currentState.localPath, "image/*", TRANSACTION_MULTIMEDIA_PROMPT.replace(/\{prompt}/g, currentState.description).replace(/\{phone_origin}/g, ctx.from));

    if(response.type == CommandType.ERROR) {
        return response;
    }
    console.log('Respuesta a enviar por json:', JSON.stringify(response));
    
    return await saveTransaction(response.payload)
}

