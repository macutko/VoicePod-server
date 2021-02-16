import {Chat} from "../../models/db";

export async function getPaidChatsByUserId(data, userId) {
    return Chat.find().or([{'customer': userId}, {'consultant': userId}]).and([{'type': 'paid'}]).limit(20).select({id: 1});
}
