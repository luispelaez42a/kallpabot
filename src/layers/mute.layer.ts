import { BotContext, BotMethods } from "@builderbot/bot/dist/types"

export default async (_: BotContext, { globalState, endFlow }: BotMethods) => {
    const botOffForEveryOne = globalState.get<boolean>('botOffForEveryOne') ?? false
    if(botOffForEveryOne) return endFlow()
}