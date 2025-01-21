import { join } from 'path'
import { createBot, createProvider, createFlow, addKeyword, utils, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { processCommand, parseStudentData, CommandType, shouldParse } from '../utils/commandInterpreter'
import { saveStudent } from "src/services/Students";
import { registerAskFlow } from './registerAsk'

export const registerStudent = addKeyword<Provider, Database>(utils.setEvent('REGISTER_FLOW'))
    .addAnswer(`Ingrese la información del alumno`, { capture: true }, async (ctx, { state, fallBack, gotoFlow }) => {
        if(!shouldParse(ctx.body))
            return gotoFlow(registerAskFlow)
        const { student, error } = parseStudentData(ctx.body);
        if (error) {
            return fallBack(error);
        }

        await state.update({ payload: student })
    })
    .addAnswer(`Ingrese evidencia del pago`, { capture: true }, async (ctx, { state, provider }) => {
        console.log("Entrooo")
        console.log(JSON.stringify(ctx?.body))
        const isPayed = true
        if(ctx?.body?.trim() == '-'){
            await state.update({ isPayed: false , photoEvidence: null })
            return;
        }

        console.log(JSON.stringify(ctx?.body))
        const localPath = await provider.saveFile(ctx, {path:'./media'});
        await state.update({ isPayed: isPayed , photoEvidence: localPath })
    })    
    .addAction(async (_, { flowDynamic, state }) => {
        const currentState = state.getMyState();
        console.log(JSON.stringify(currentState));
    
        const formattedState = { payload: currentState.payload }; // Ajusta la estructura
        const response = await saveStudent(formattedState);
        await flowDynamic(`${response.message}`);
    });


export const registrarAlumno = (args) => {
    return {
        type: 'SUCCESS',
        command: 'registrarAlumno',
        message: `Registrando alumno con datos: ${args.join(' ')}`,
        additionalData: 'Aquí puedes agregar más datos si lo necesitas'
    };
};