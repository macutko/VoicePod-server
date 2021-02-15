import {__getUserAndProfileById} from "./_util";

export async function getBusinessCountry(userId) {
    let [user, profile] = await __getUserAndProfileById(userId)
    return profile.country
}
