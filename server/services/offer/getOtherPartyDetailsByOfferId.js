import {Offer} from "../../models/db";

export async function getOtherPartyDetailsByOfferId(data, userId) {
    if (!data.offerId) throw 'Need offer id'

    let offer = await Offer.findById(data.offerId).or([{'customer': userId}, {'consultant': userId}]).populate({
        path: 'customer',
        select: "username firstName lastName profilePicture pictureType ",
        match: {_id: {$ne: userId}}
    }).populate({
        path: 'consultant',
        select: "username firstName lastName profilePicture pictureType ",
        match: {_id: {$ne: userId}}
    }).populate({
        path: 'lastMessage',
        select: "read"
    });

    if (!offer) throw 'no such offer'
    // if customer is true that means the user return is a customer
    if (offer.customer) return {...offer.customer.toJSON(), customer: true}
    else return {...offer.consultant.toJSON(), customer: false}
}

