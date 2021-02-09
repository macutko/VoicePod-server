import {Chat} from "../../models/db";

export async function getPaidChatsByUserId(userId) {
    console.log('here')
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
    console.log(ret)
    return ret
}
