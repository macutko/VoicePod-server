import {Offer} from "../../models/db";

/**
 * Get all the offers associated with a user where he is consultant
 * @param data
 * @param userId
 *
 */
export async function getPendingOffersByUserId(data, userId) {
    return Offer.find().and([{'consultant': userId}, {'status': 'pending'}]).limit(20).select({id: 1})
}
