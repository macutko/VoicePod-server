import {Chat, User} from "../../models/db";
import {Config} from "../../config";
let config = new Config()

export async function closeChat(data, userId) {
    let chat = await Chat.findById(data.chatId).or([{'customer': userId}, {'consultant': userId}])

    let consultant = await User.findById(chat.consultant).populate({path: 'businessProfile'})
    if (!consultant) throw' There is no consultant to this chat'

    //TODO: handle delete of user consultant before closechat

    let consultantStripe = await config.stripe.accounts.retrieve(consultant.businessProfile.stripeId)

    chat.status = 'closed'

    await chat.save()

    return true
}
