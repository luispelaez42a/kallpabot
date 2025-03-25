import { EVENTS, createBot, createProvider, createFlow, addKeyword, MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import Interpreter from '../services/ai/interpreter'
import { typing } from "../utils/presence"
import { generateConversationPrompt, Enrollments } from "../utils/prompts"
import { handleHistory, getHistories, getHistoriesParsedToString } from "../utils/handleHistory"
import { cleanJSON, mergeJSON } from '~/utils/utils'

const enrollmentFlow = addKeyword<Provider, Database>(EVENTS.ACTION)
    .addAction(async (ctx, { flowDynamic, state, provider, extensions }): Promise<void> => {
        console.log(`[ENROLL]:`)
        console.log(JSON.stringify(ctx))
        await typing(ctx, provider)
        const currentState = state.getMyState();
        const history = getHistories(state)
        let prompt
        const historyString = getHistoriesParsedToString(state)
        console.log("====HISTORY")
        console.log(historyString)

        prompt = Enrollments.PROMPT_RESUMEN_ENROLLMENT.replace('{HISTORY}', historyString)        

        if(currentState.enrollmentUserData) {
           prompt = Enrollments.PROMPT_RESUMEN_ENROLLMENT.replace('{DATA}', JSON.stringify(currentState.enrollmentUserData))        
        }

        console.log("====prompteta")
        console.log(prompt)
        
        const interpreter = extensions.ai as Interpreter
        const response = await interpreter.interprets(prompt, history)
        console.log("IA RESPONDE" + response.payload)

        const payload = cleanJSON(response.payload)
        let contextUserEnroll = mergeJSON(currentState.enrollmentUserData, payload) 
        await state.update({ enrollmentUserData: contextUserEnroll })
        //if (aiResponse.includes(['talara','ubicación'])) provider.sendLocation(ctx.key.remoteJid, -12.0707209,-77.0452049)

        await handleHistory({ content: payload.message, role: 'model' }, state)

        return flowDynamic(payload.message);
    });

export { enrollmentFlow }