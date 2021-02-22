import sanitize from 'mongo-sanitize';
import { __validateUser } from './_util';

export async function getReviewByChatId(data, userId) {
    data = sanitize(data);

    // eslint-disable-next-line no-unused-vars
    let [review, chat] = await __validateUser(data, userId);

    if (review) {
        for (let item of review) {
            if (item.from.equals(userId)) {
                return item.toJSON();
            }
        }
    } else return {};
}
