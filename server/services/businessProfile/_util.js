import { BusinessProfile, User } from '../../models/db';

export async function __getUserAndProfileById(userId) {
    let user = await User.findById(userId);
    if (!user) throw 'No such user';
    let profile = await BusinessProfile.findById(user.businessProfile);
    if (!profile) throw 'No profile for this user';
    return [user, profile];
}
