import {Chat, User} from "../../models/db";

/**
 * Function to create a free chat
 * @param data
 * @param userId
 * @returns {Promise<chatId>}
 */
export async function createFreeChat(data, userId) {
    if (!data.username) throw 'Need a username to initiate chat'
    let customer = await User.findById(userId)
    let consultant = await User.findOne({username: data.username})
    if (!consultant || !customer) throw 'Missing a user in this party'

    let chat = new Chat({
        customer: customer.id,
        consultant: consultant.id,
        type: 'free',
        status: "open",
        lastMessage: null
    })

    return chat.save()

}
