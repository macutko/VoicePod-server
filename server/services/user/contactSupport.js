import { User } from '../../models/db';
import { sendNewBug } from '../../utils/mailers';

export async function contactSupport(data, userId) {
    if (!data.title) throw 'Need a title';
    if (!data.message) throw 'Need a message';
    let user = await User.findById(userId);
    if (user) {
        return await sendNewBug(
            `By: ${user.email}, Title: ${data.title}`,
            data.message
        );
    }
    return false;
}
