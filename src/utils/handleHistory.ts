export type History = { role: 'user' | 'model', content?: string , parts?: any[] };
import { BotStateStandAlone } from "@builderbot/bot/dist/types"

const handleHistory = async (inside: History, _state: BotStateStandAlone) => {
    if(!inside.content) return;

    const parts = [{text: inside.content.trim()}];
    inside.parts = parts;
    const history = _state.get('history') ?? [];
    history.push(inside);
    const limitedHistory = history.length > 10 ? history.slice(-10) : history;
    await _state.update({ 'history': limitedHistory });
};


const getHistoriesParsedToString = (_state: BotStateStandAlone, k = 5, onlyUser = false): string => {
    const history = _state.get<History[]>('history') ?? [];
    let limitHistory = history.slice(-k);

    return limitHistory
        .map(({ role, content }) => role === 'user' 
            ? `Cliente: "${content}"` 
            : `\nSeller: "${content}"\n`
        ).join('\n');
};

const clearHistory = async (_state: BotStateStandAlone) => {
    _state.clear();
};


const getHistories = (_state: BotStateStandAlone, k = 5) => {
    const history = _state.get<History[]>('history') ?? []
    const limitHistory = history.slice(-k)
    return limitHistory.map(({ role, parts }) => ({ role, parts }));
}

const conversationalLayer = async ({ body }, { state }) => {
    await handleHistory({ content: body, role: 'user' }, state);
};

export { getHistories, clearHistory, conversationalLayer, handleHistory, getHistoriesParsedToString };