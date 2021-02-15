import {Chat} from "../../models/db";

export async function getOfferFromChat(data, userId) {
    let chat = await Chat.findById(data.chatId).or([{'customer': userId}, {'consultant': userId}])
    if (!chat) throw 'no such chat'
    return {
        introSoundBits: chat.introSoundBits,
        problemSoundBits: chat.problemSoundBits,
        budgetMinutes: chat.budgetMinutes,
        price: chat.price

    }
}
