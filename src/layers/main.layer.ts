import { BotContext, BotMethods } from "@builderbot/bot/dist/types";
import { getHistories, getHistoriesParsedToString } from "../utils/handleHistory"
import Interpreter from "../services/ai/interpreter"
//import { sellerFlow } from "../flows/seller"
//import { confirmFlow } from "../flows/confirm"
import { Intentions } from "../utils/prompts"
import { sellerFlow } from "~/flows/seller";
import { isDefaultUser } from "~/utils/utils";
import { defaultWelcome } from "~/flows/defaultWelcomeFlow";
import { enrollmentFlow } from "~/flows/enrollment";
import { registerAskFlow } from "~/flows/registerAsk";

export default async (ctx: BotContext, { state, gotoFlow, extensions }: BotMethods) => {
    const interpreter = extensions.ai as Interpreter
    console.log(`[Context]:`, ctx)
    console.log(`[State]:`, JSON.stringify(state))

    if (isDefaultUser(ctx.from)) {
    const history = getHistoriesParsedToString(state)
    const prompt = Intentions.PROMPT_DISCRIMINATOR.replace('{HISTORY}', history)
    
    console.log(history)
    console.log(prompt)
    const intention = await interpreter.interprets(prompt)
    //console.log(`[Intention]:`, intention)

    if (intention.payload && intention.payload.includes('ENROLLMENT')) return gotoFlow(registerAskFlow)
    //if (intention.includes('CONFIRM')) return gotoFlow(confirmFlow)
    return gotoFlow(sellerFlow)
       // console.log("Logs holaa default");
       // return gotoFlow(defaultWelcome);
    }


}