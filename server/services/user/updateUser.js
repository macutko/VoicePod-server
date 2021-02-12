import {Config} from "../../config";
import {BusinessProfile, User} from "../../models/db";

let config = new Config();

export async function updateUser(req) {

    let data = req.body
    let user = await User.findById(req.user.sub).populate({path: 'businessProfile'})
    if (!user) throw "No such user!"

    if (data.profilePicture && data.pictureType) {
        // TODO: check that this is a file that works
        user.profilePicture = data.profilePicture
        user.pictureType = data.pictureType
    }
    if (data.firstName) {
        user.firstName = data.firstName
    }
    if (data.lastName) {
        user.lastName = data.lastName
    }
    if (data.description) {
        user.description = data.description
    }
    let accountLinks;

    if (data.businessActivated != null || data.businessActivated !== undefined) {
        user.businessActivated = data.businessActivated

        if (data.businessActivated && !user.businessProfile) {

            const account = await config.stripe.accounts.create({
                type: 'express',
            });

            let new_BusinessProfile = new BusinessProfile({stripeId: account.id})
            await new_BusinessProfile.save()
            user.businessProfile = new_BusinessProfile.id


            accountLinks = await config.stripe.accountLinks.create({
                account: account.id,
                refresh_url: 'https://example.com/reauth',
                return_url: 'https://example.com/return',
                type: 'account_onboarding',
            });
        } else if (data.businessActivated && user.businessProfile) {
            const account = await config.stripe.accounts.retrieve(user.businessProfile.stripeId);

            accountLinks = await config.stripe.accountLinks.create({
                account: account.id,
                refresh_url: 'https://example.com/reauth',
                return_url: 'https://example.com/return',
                type: 'account_onboarding', //change to update
            });
        }
    }


    await user.save()

    if (accountLinks && accountLinks.url) {
        return {url: accountLinks.url}
    }
    return user.toJSON()
}

