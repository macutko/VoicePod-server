import {Chat} from "../../models/db";

export async function getPaidChatsByUserId(data, userId) {
    let ret = await Chat.find().or([{'customer': userId}, {'consultant': userId}]).and([{'type': 'paid'}])
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
    console.log(Object.keys(ret))
    return ret
}
