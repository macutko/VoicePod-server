import {Chat, User} from '../models/db'
import {Config} from "../config";
import {checkChatData} from "./message.service";

let config = new Config()

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

export async function closeChat(data, userId) {
    let [chat, user] = await checkChatData(data, userId)

    let consultant = await User.findById(chat.consultant).populate({path: 'businessProfile'})
    if (!consultant) throw' There is no consultant to this chat'

    //TODO: handle delete of user consultant before closechat

    let consultantStripe = await config.stripe.accounts.retrieve(consultant.businessProfile.stripeId)

    // if (!consultantStripe)

    chat.status = 'closed'

    await chat.save()

    return true
}

export async function getChatByUserId(userId) {
    return Chat.find().or([{'customer': userId}, {'consultant': userId}])
        .populate({
            path: 'customer',
            select: "username firstName lastName profilePicture pictureType",
            match: {_id: {$ne: userId}}
        }).populate({
            path: 'consultant',
            select: "username firstName lastName profilePicture pictureType",
            match: {_id: {$ne: userId}}
        }).populate({
            path: 'lastMessage',
            select: "read"
        }).limit(20);
}

export async function getMinutesBalance(data, userId) {
    let m = await Chat.findById(data.chatId).or([{'customer': userId}, {'consultant': userId}])

    let balance = m.budgetMinutes - m.usedMinutes
    return {minutes: balance}
}


