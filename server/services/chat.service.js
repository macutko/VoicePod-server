import {Chat, Offer, User} from '../models/db'
import {Config} from "../config";
import {checkChatData} from "./message.service";

let config = new Config()

export async function closeChat(data, userId) {
    console.log(data.chatId)
    let[chat,user] = await checkChatData(data,userId)

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


