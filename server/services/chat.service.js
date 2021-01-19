import {Chat, Offer, User} from '../models/db'

export async function getChatByUserId(userID) {
    return Chat.find().or([{'noob': userID}, {'consultant': userID}])
        .populate({
            path: 'noob',
            select: "username firstName lastName profilePicture pictureType",
            match: {_id: {$ne: userID}}
        }).populate({
            path: 'consultant',
            select: "username firstName lastName profilePicture pictureType",
            match: {_id: {$ne: userID}}
        }).populate({
            path: 'lastMessage',
            select: "read"
        }).limit(20);
}

export async function getMinutesBalance(data, userId) {
    let m = await Chat.findById(data.chatId).or([{'noob': userId}, {'consultant': userId}]).populate({
        path: 'offer',
        select: 'budgetMinutes usedMinutes'
    })

    let balance = m.offer.budgetMinutes - m.offer.usedMinutes
    console.log(balance)
    return {minutes: balance}
}

export async function getOfferById(data, userID) {
    return Offer.findById(data.offerId)
}

export async function decisionOfferById(data, userId, decision) {
    let chat = await Chat.find({offer: data.offerId}).and({consultant: userId})
    if (!chat) throw 'Not possible'
    let offer = await Offer.findById(data.offerId)
    offer.accepted = decision
    offer.dateOfDecision = Date.now()
    return offer.save();

}


export async function offerProposition(data, userID) {
    if (!data.username) throw 'Need a consultant username'
    if (!data.intro || !data.problem || !data.advice || !data.outcome || !data.budget) throw 'No voice clip or budget'

    if (!userID) throw 'SECURITY ISSUE!'

    let consultant = await User.findOne({username: data.username})


    let newOffer = new Offer({
        introSoundBits: data.intro,
        problemSoundBits: data.problem,
        adviceSoundBits: data.advice,
        outcomeSoundBits: data.outcome,
        budgetMinutes: data.budget
    })

    newOffer = await newOffer.save()

    let newChat = new Chat({
        offer: newOffer.id,
        consultant: consultant.id,
        noob: userID,
    })

    let n = await newChat.save()

    return n.toJSON()
}


