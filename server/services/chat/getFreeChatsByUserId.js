import { Chat } from '../../models/db';

export async function getFreeChatsByUserId(data, userId) {
    return Chat.find()
        .or([{ customer: userId }, { consultant: userId }])
        .and([{ type: 'free' }])
        .limit(20)
        .select({ id: 1 });
}
