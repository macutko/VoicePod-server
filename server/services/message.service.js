import {Chat, Message, User,Offer} from '../models/db'
import * as fs from "fs";
import getAudioDurationInSeconds from "get-audio-duration";

/**
 * Function used to check whether the message operation can happen.
 *
 * @param data - data passed in by the socket, much have chat id
 * @param userId - user ID decoded from token
 * @returns {Promise<any[]>} - should return relevant chat object and user object
 */

async function checkChatData(data, userId) {
    if (!data.chatId) throw 'Need a chatId!'
    if (!userId) throw 'need a user ID'

    let chat = await Chat.findById(data.chatId).or([{'noob': userId}, {'consultant': userId}])
    if (!chat) throw 'No chat by this ID'

    let user = await User.findById(userId)
    if (!user) throw 'No user by this ID'

    return [chat, user]
}

export async function getMessages(data, userId) {
    let [chat, user] = await checkChatData(data, userId)

    return Message.find({chatId: chat.id}).populate({
        path: 'from',
        select: "firstName lastName email username"
    }).limit(20);

}


export async function newMessage(data, userId) {
    let [chat, user] = await checkChatData(data, userId)

    if (!data.voiceClip) throw 'Need a sound'

    let fileName = `${data.chatId}_${userId}.wav`
    let buff = Buffer.from(data.voiceClip, 'base64');
    await fs.writeFileSync(fileName, buff)
    let duration = (await getAudioDurationInSeconds(fileName)).toFixed(0)


    if (duration <= 0) throw 'Short audio'

    duration = (duration / 60).toFixed(2)


    let message = new Message({
        from: user.id,
        chatId: chat.id,
        soundBits: data.voiceClip,
        duration: duration
    })


    await message.save()

    if (chat.noob.equals(userId)) {
        console.log('need to fix the offer')
        console.log(chat.offer)
        order.usedMinutes = order.usedMinutes + duration
        await order.save()
    }

    chat.lastMessage = message._id
    await chat.save()

    return Message.findById(message._id).populate({
        path: 'from',
        select: "firstName lastName email username"
    })
}


//
///**
//  * Function used by the new message endpoint.
//  * @param data
//  * @param userID
//  * @returns {Promise<unknown>}
//  */
// async function handleSoundMessage(data, userID) {
//
//     let fileName = `${data.chatId}_${userID}.wav`
//     let buff = Buffer.from(data.sound, 'base64');
//     await fs.writeFileSync(fileName, buff)
//
//     let options = {
//         mode: 'text',
//         args: [fileName, 'en-EN']
//     };
//
//     return new Promise((resolve, reject) => {
//
//         PythonShell.run('server/services/py_speech/speech_to_text.py', options, (err, res) => {
//             fs.unlink(fileName, (e) => {
//                 error(e)
//                 if (e) reject(e);
//             });
//
//             if (err) {
//                 error(err)
//                 reject(err)
//             }
//             if (res) {
//                 positive_action('Sound Message!', res)
//                 resolve(new Message({
//                     from: userID,
//                     chatID: data.chatId,
//                     message: res.join('.'),
//                     sound: true,
//                     sound_bits: data.sound
//                 }))
//             }
//         });
//     })
//
// }
