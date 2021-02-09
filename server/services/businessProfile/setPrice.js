import {__getUserAndProfileById} from "./_util";

export async function setPrice(data, userId) {
    if (!data.price) throw 'need price'
    if (data.price <= 0 || isNaN(data.price)) throw 'Bad price format'

    let [user, profile] = await __getUserAndProfileById(userId)

    profile.price = data.price
    await profile.save()
    return true
}
