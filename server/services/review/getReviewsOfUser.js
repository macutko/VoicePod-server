import { Review, User } from '../../models/db';

export async function getReviewsOfUser(data, userId) {
    if (!data.username) throw 'Need some data';
    let user;

    user = await User.findOne({ username: data.username });

    if (!user) throw 'Security issue';

    return Review.find({ about: user.id })
        .populate({
            path: 'from',
            select: 'username firstName lastName profilePicture pictureType',
        })
        .limit(20);
}
