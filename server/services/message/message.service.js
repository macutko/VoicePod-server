import {Chat, Message, User} from '../../models/db'
import * as fs from "fs";
import getAudioDurationInSeconds from "get-audio-duration";
import {error} from "../../utils/logging";

/**
 * Internally used function to validate if chat can be accessed by the user
 * @param data
 * @param userId
 * @returns {Promise<any[]>}
 */
export async function checkChatData(data, userId) {
    if (!data.chatId) throw 'Need a chatId!'
    if (!userId) throw 'need a user ID'

    let chat = await Chat.findById(data.chatId).or([{'customer': userId}, {'consultant': userId}])
    if (!chat) throw 'No chat by this ID'

    let user = await User.findById(userId)
    if (!user) throw 'No user by this ID'

    return [chat, user]
}

/**
 * Not active yet. However fully functional.
 */
// export async function getTranscript(data, userId) {
//     if (!data.messageId) throw 'need a message Id'
//     let message = await Message.findById(data.messageId)
//     if (message.transcript !== '') return [true, message.transcript]
//
//     let [chat, user] = await checkChatData({chatId: message.chatId}, userId)
//
//     let success;
//     await axiosInstance.post('get_transcript', {
//         soundBits: message.soundBits,
//         name: `${data.messageId}_${userId}.wav`
//     }).then((response) => {
//         if (response.data) {
//             if (response.data.success) {
//                 message.transcript = response.data.text
//                 success = true
//             } else {
//                 success = false
//             }
//         }
//     }).catch((err) => {
//         error(err)
//     });
//
//     await message.save()
//
//     return [success, message.transcript]
// }

/***
 * To get all the messages that belong to a specific chat
 * @param data
 * @param userId
 * @returns {Promise<Query<Array<Document>, Document>>}
 */
export async function getMessages(data, userId) {
    let [chat, user] = await checkChatData(data, userId)

    return Message.find({chatId: chat.id}).populate({
        path: 'from',
        select: "firstName lastName email username"
    }).limit(20);

}

/**
 * New message being created
 * @param data
 * @param userId
 * @returns {Promise<(boolean|{message: string})[]|(boolean|LeanDocument<Document>)[]>}
 */
export async function createMessage(data, userId) {
    let [chat, user] = await checkChatData(data, userId)

    if (!data.voiceClip) throw 'Need a sound'

    let fileName = `${data.chatId}_${userId}.wav`
    let buff = Buffer.from(data.voiceClip, 'base64');
    await fs.writeFileSync(fileName, buff)
    let duration = parseFloat((await getAudioDurationInSeconds(fileName)).toFixed(0))

    try {
        fs.unlinkSync(fileName)
    } catch (err) {
        error(`Fialed to remove file ${err}`)
    }

    if (duration <= 0) throw 'Short audio'

    duration = parseFloat((duration / 60).toFixed(2))


    if (chat.customer.equals(userId) && chat.type === 'paid') {

        if (parseFloat((chat.usedMinutes + duration).toFixed(2)) > chat.budgetMinutes) {
            return [false, {message: 'Not enough minutes left'}]
        } else {
            chat.usedMinutes = parseFloat((chat.usedMinutes + duration).toFixed(2))
        }
    }


    let message = new Message({
        from: user.id,
        chatId: chat.id,
        soundBits: data.voiceClip,
        duration: duration
    })


    await message.save()

    if (chat.type === 'free') {
        Message.findOneAndDelete({_id: chat.lastMessage})
    }

    chat.lastMessage = message._id
    await chat.save()
    console.log('Message created')

    return [true, message.toJSON()]
}
