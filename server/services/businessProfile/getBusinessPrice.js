import { __getUserAndProfileById } from './_util';

export async function getBusinessPrice(userId) {
    // eslint-disable-next-line no-unused-vars
    let [user, profile] = await __getUserAndProfileById(userId);
    return [profile.price, profile.currency];
}
