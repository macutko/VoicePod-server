import { Config } from '../../config';
import { BusinessProfile, User } from '../../models/db';

let config = new Config();

export async function updateUser(req) {
    let data = req.body;
    let user = await User.findById(req.user.sub).populate({
        path: 'businessProfile',
    });
    if (!user) throw 'No such user!';

    if (data.profilePicture && data.pictureType) {
    // TODO: check that this is a file that works
        user.profilePicture = data.profilePicture;
        user.pictureType = data.pictureType;
    }
    if (data.firstName) {
        user.firstName = data.firstName;
    }
    if (data.lastName) {
        user.lastName = data.lastName;
    }
    if (data.description) {
        user.description = data.description;
    }
    let accountLinks;

    if (data.businessActivated != null || data.businessActivated !== undefined) {
        user.businessActivated = data.businessActivated;

        if (data.businessActivated && !user.businessProfile) {
            const account = await config.stripe.accounts.create({
                type: 'express',
            });

            let newBusinessProfile = new BusinessProfile({ stripeId: account.id });
            await newBusinessProfile.save();
            user.businessProfile = newBusinessProfile.id;

            accountLinks = await config.stripe.accountLinks.create({
                account: account.id,
                refreshUrl: 'https://example.com/reauth',
                returnUrl: 'https://example.com/return',
                type: 'account_onboarding',
            });
        } else if (data.businessActivated && user.businessProfile) {
            const account = await config.stripe.accounts.retrieve(
                user.businessProfile.stripeId
            );

            accountLinks = await config.stripe.accountLinks.create({
                account: account.id,
                refreshUrl: 'https://example.com/reauth',
                returnUrl: 'https://example.com/return',
                type: 'account_onboarding', // change to update
            });
        }
    }

    await user.save();

    if (accountLinks && accountLinks.url) {
        return { url: accountLinks.url };
    }
    return user.toJSON();
}
