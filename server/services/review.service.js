import {Chat, Review, User} from "../models/db";
import sanitize from "mongo-sanitize";

async function __validateUser(data, userId) {
    if (!data.chatId) throw 'Need a chatId'
    if (!userId) throw 'Security alert'

    let chat = await Chat.findById(data.chatId).or([{'customer': userId}, {'consultant': userId}])
    if (!chat) throw 'No such chat'

    return [await Review.find({chatId: chat.id}).or([{'from': userId}, {'about': userId}]), chat]

}

export async function updateReviewByChatId(data, userId) {
    data = sanitize(data);
    let [review, chat] = await __validateUser(data, userId)

    if (!data.title) throw 'need a title'
    if (!data.review) throw 'Need a description'
    if (!data.stars) throw 'Need rating'

    let params = {
        title: data.title,
        chatId: data.chatId,
        from: userId,
        about: (chat.consultant.equals(userId) ? chat.customer : chat.consultant),
        review: data.review,
        stars: data.stars
    }

    let new_rev;
    if (review.length === 0) {
        new_rev = new Review(params)
        await new_rev.save()
    } else {
        new_rev = await Review.updateOne({_id: review.id}, params)
    }

    return new_rev
}

export async function getReviewByChatId(data, userId) {

    data = sanitize(data);

    let [review, chat] = await __validateUser(data, userId)

    if (review) {
        for (let item of review) {
            if (item.from.equals(userId)) {
                return item.toJSON()
            }
        }
    } else return {}
}

export async function getReviewsOfUser(data, userId) {
    if (!data.username) throw 'Need some data'
    let user;

    user = await User.findOne({"username": data.username})

    if (!user) throw 'Security issue'

    return Review.find({'about': user.id}).populate({
        path: 'from',
        select: "username firstName lastName profilePicture pictureType"
    }).limit(20);
}