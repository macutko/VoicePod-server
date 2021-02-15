import {Chat} from "../../models/db";

export async function getMinutesBalance(data, userId) {
    let m = await Chat.findById(data.chatId).or([{'customer': userId}, {'consultant': userId}])
    if (!m) throw 'no such chat'
    let balance = m.budgetMinutes - m.usedMinutes
    return {minutes: balance}
}
