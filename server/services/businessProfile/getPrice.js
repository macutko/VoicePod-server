import {__getUserAndProfileById} from "./_util";


export async function getPrice(userId) {
    let [user, profile] = await __getUserAndProfileById(userId)
    return [profile.price, profile.currency]
}
