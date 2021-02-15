import {Chat, Review} from "../../models/db";

export async function __validateUser(data, userId) {
    if (!data.chatId) throw 'Need a chatId'
    if (!userId) throw 'Security alert'

    let chat = await Chat.findById(data.chatId).or([{'customer': userId}, {'consultant': userId}])
    if (!chat) throw 'No such chat'

    return [await Review.find({chatId: chat.id}).or([{'from': userId}, {'about': userId}]), chat]

}
