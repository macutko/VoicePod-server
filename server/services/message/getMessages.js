import {Message} from "../../models/db";
import {checkChatData} from "./_util";

/***
 * To get all the messages that belong to a specific chat
 * @param data
 * @param userId
 * @returns {Promise<Query<Array<Document>, Document>>}
 */
export async function getMessages(data, userId) {
    let [chat, user] = await checkChatData(data, userId)

    return Message.find({chatId: chat.id}).populate({
        path: 'from',
        select: "firstName lastName email username"
    }).limit(20);

}
