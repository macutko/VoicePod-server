import {__getUserAndProfileById} from "./_util";

export async function getCountry(userId) {
    let [user, profile] = await __getUserAndProfileById(userId)
    return profile.country
}
