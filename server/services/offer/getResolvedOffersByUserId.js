import {Offer} from "../../models/db";

/**
 * Get all the offers associated with a user
 * @param data
 * @param userId
 *
 */
export async function getResolvedOffersByUserId(data, userId) {
    return Offer.find().or([
        {$and: [{'consultant': userId}, {'status': 'rejected'}]},
        {$and: [{'consultant': userId}, {'status': 'accepted'}]},
        {$and: [{'customer': userId}, {'status': 'rejected'}]},
        {$and: [{'customer': userId}, {'status': 'accepted'}]},
    ]).limit(20).select({id: 1})
}
