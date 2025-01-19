import { join } from 'path'
import { createBot, createProvider, createFlow, addKeyword, utils, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { processCommand, parseStudentData, CommandType, shouldParse } from '../utils/commandInterpreter'
import { saveStudent } from "src/services/Students";

export const registerAskFlow = addKeyword<Provider, Database>(utils.setEvent('REGISTER_ASK_FLOW'))
.addAnswer(`Ingrese el nombre del alumno`, { capture: true }, async (ctx, { state }) => {
    await state.update({ name: ctx.body })
})
.addAnswer(`Ingrese el telf del alumno`, { capture: true }, async (ctx, { state }) => {
    await state.update({ phone: ctx.body })
})
.addAnswer(`Ingrese el curso del alumno`, { capture: true }, async (ctx, { state }) => {
    await state.update({ course: ctx.body })
})
.addAnswer(`Ingrese el turno del alumno`, { capture: true }, async (ctx, { state }) => {
    await state.update({ schedule: ctx.body })
})
.addAnswer(`Ingrese el duración matrícula del alumno(En meses)`, { capture: true }, async (ctx, { state }) => {
    await state.update({ duration: ctx.body })
})
.addAnswer(`Ingrese el inicio matrícula del alumno\n(Usar Formato -> 01/01/2025)`, { capture: true }, async (ctx, { state }) => {
    await state.update({ startDay: ctx.body })
})
.addAnswer(`Ingrese evidencia del pago`, { capture: true }, async (ctx, { state, provider }) => {
    console.log("Entrooo")
    console.log(JSON.stringify(ctx?.body))
    const localPath = await provider.saveFile(ctx, {path:'./media'});
    console.log(localPath)

    var isPayed = true
    if(ctx?.body?.trim() == '-')
        isPayed = false;

    await state.update({ isPayed: isPayed , photoEvidence: localPath })
})
.addAction(async (_, { flowDynamic, state }) => {
    const currentState = state.getMyState();
    console.log(JSON.stringify(currentState));

    const formattedState = { payload: currentState.payload }; // Ajusta la estructura
    const response = await saveStudent(formattedState);
    await flowDynamic(`${response.message}`);
});
