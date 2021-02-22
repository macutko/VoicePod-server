import {Offer} from "../../models/db";

/**
 * get a specific offer by its ID
 * @param data
 * @param userId
 * @returns {Promise<Query<Document | null, Document>>}
 */
export async function getOfferById(data, userId) {
    return Offer.findById(data.offerId).or([{'customer': userId}, {'consultant': userId}]).select({
        introSoundBits: 1,
        problemSoundBits: 1,
        budgetMinutes: 1,
        status: 1,
        dateOfDecision: 1,
        createdDate: 1,
        price: 1
    })
}
