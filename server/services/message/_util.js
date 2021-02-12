import {Chat, User} from "../../models/db";

/**
 * Internally used function to validate if chat can be accessed by the user
 * @param data
 * @param userId
 * @returns {Promise<any[]>}
 */
export async function checkChatData(data, userId) {
    if (!data.chatId) throw 'Need a chatId!'
    if (!userId) throw 'need a user ID'

    let chat = await Chat.findById(data.chatId).or([{'customer': userId}, {'consultant': userId}])
    if (!chat) throw 'No chat by this ID'

    let user = await User.findById(userId)
    if (!user) throw 'No user by this ID'

    return [chat, user]
}
