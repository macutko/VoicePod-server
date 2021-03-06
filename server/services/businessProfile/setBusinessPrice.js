import { __getUserAndProfileById } from './_util';

export async function setBusinessPrice(data, userId) {
    if (!data.price) throw 'need price';
    if (data.price <= 0 || isNaN(data.price)) throw 'Bad price format';

    // eslint-disable-next-line no-unused-vars
    let [user, profile] = await __getUserAndProfileById(userId);

    profile.price = data.price;
    await profile.save();
    return true;
}
