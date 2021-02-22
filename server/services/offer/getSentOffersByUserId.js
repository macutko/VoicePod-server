import {Offer} from "../../models/db";

/**
 * Get all the offers associated with a user
 * @param data
 * @param userId
 *
 */
export async function getSentOffersByUserId(data, userId) {
    return Offer.find().and([{'customer': userId}, {'status': 'pending'}]).limit(20).select({id: 1})
}
