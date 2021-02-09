import {Chat} from "../../models/db";

export async function getFreeChatsByUserId(userId) {
    return Chat.find().or([{'customer': userId}, {'consultant': userId}]).and([{'type':'free'}])
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
