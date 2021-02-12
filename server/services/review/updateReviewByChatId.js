import sanitize from "mongo-sanitize";
import {Review} from "../../models/db";
import {__validateUser} from "./_util";

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
