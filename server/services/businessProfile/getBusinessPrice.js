import {__getUserAndProfileById} from "./_util";


export async function getBusinessPrice(userId) {
    let [user, profile] = await __getUserAndProfileById(userId)
    return [profile.price, profile.currency]
}
