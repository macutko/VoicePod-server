import {Offer} from "../../models/db";

/**
 * Get all the offers associated with a user
 * @param userId
 *
 */
export async function getOffersByUserId(userId) {
    return new Promise((resolve, reject) =>
        Offer.find().or([{'customer': userId}, {'consultant': userId}])
            .limit(20).populate({
            path: 'customer',
            select: "username firstName lastName profilePicture pictureType",
            match: {_id: {$ne: userId}}
        }).populate({
            path: 'consultant',
            select: "username firstName lastName profilePicture pictureType",
            match: {_id: {$ne: userId}}
        }).exec(function (err, offer) {
            try {
                if (err) reject(err)
                let data = [];
                for (const o of offer) {
                    // if requesting user is the consultant, the customer object will not be empty
                    if (o.customer) {
                        data.push({id: o.id, isCustomer: false, user: o.customer})
                    } else {
                        data.push({id: o.id, isCustomer: true, user: o.consultant})
                    }
                }
                resolve(data)
            } catch (e) {
                reject(e)
            }

        }))
}
