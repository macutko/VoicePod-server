import { Chat } from '../../models/db';

export async function getOtherPartyDetailsByChatId(data, userId) {
    if (!data.chatId) throw 'Need chat id';

    let chat = await Chat.findById(data.chatId)
        .or([{ customer: userId }, { consultant: userId }])
        .populate({
            path: 'customer',
            select: 'username firstName lastName profilePicture pictureType ',
            match: { _id: { $ne: userId } },
        })
        .populate({
            path: 'consultant',
            select: 'username firstName lastName profilePicture pictureType ',
            match: { _id: { $ne: userId } },
        })
        .populate({
            path: 'lastMessage',
            select: 'read',
        });

    if (!chat) throw 'no such chat';
    if (chat.customer)
        return { ...chat.customer.toJSON(), customer: true, type: chat.type };
    return { ...chat.consultant.toJSON(), customer: false, type: chat.type };
}
