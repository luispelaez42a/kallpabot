import { EVENTS, createBot, createProvider, createFlow, addKeyword, MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import Interpreter from '../services/ai/interpreter'
import { typing } from "../utils/presence"
import { Enrollments, generateConversationPrompt, Seller } from "../utils/prompts"
import { handleHistory, getHistories, getHistoriesParsedToString } from "../utils/handleHistory"
import { cleanJSON, mergeJSON } from '~/utils/utils'

const sellerFlow = addKeyword<Provider, Database>(EVENTS.ACTION)
    .addAction(async (ctx, { flowDynamic, state, provider, extensions }): Promise<void> => {
        console.log(`[Seller]:`)
        console.log(JSON.stringify(ctx))
        await typing(ctx, provider)
        const history = getHistories(state)
        const currentState = state.getMyState();

        let prompt = generateConversationPrompt(Seller.BASE_PROMPT_2, {
            QUESTION : ctx.body,
            DATABASE_INPUT : Seller.DATABASE_INPUT
        })
        
        if(currentState.enrollmentUserData) {
            prompt = Enrollments.PROMPT_RESUMEN_ENROLLMENT.replace('{DATA}', JSON.stringify(currentState.enrollmentUserData))        
        } 

        const interpreter = extensions.ai as Interpreter
        const response = await interpreter.interprets(prompt, history)

        const payload = cleanJSON(response.payload)
        let contextUserEnroll = mergeJSON(currentState.enrollmentUserData, payload) 
        await state.update({ enrollmentUserData: contextUserEnroll })
        //if (aiResponse.includes(['talara','ubicación'])) provider.sendLocation(ctx.key.remoteJid, -12.0707209,-77.0452049)

        await handleHistory({ content: response.payload, role: 'model' }, state)

        //return flowDynamic(response.payload.replace("**", "*"));
        return flowDynamic(payload.message);
    });

export { sellerFlow }