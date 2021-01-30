import {Chat, Message, User} from '../models/db'
import * as fs from "fs";
import getAudioDurationInSeconds from "get-audio-duration";
import {error} from "../utils/logging";
import {axiosInstance} from "../utils/connectionInstances";


export async function checkChatData(data, userId) {
    if (!data.chatId) throw 'Need a chatId!'
    if (!userId) throw 'need a user ID'

    let chat = await Chat.findById(data.chatId).or([{'customer': userId}, {'consultant': userId}])
    if (!chat) throw 'No chat by this ID'

    let user = await User.findById(userId)
    if (!user) throw 'No user by this ID'

    return [chat, user]
}


export async function getTranscript(data, userId) {
    if (!data.messageId) throw 'need a message Id'
    let message = await Message.findById(data.messageId)
    if (message.transcript !== '') return [true, message.transcript]

    let [chat, user] = await checkChatData({chatId: message.chatId}, userId)

    let success;
    await axiosInstance.post('get_transcript', {
        soundBits: message.soundBits,
        name: `${data.messageId}_${userId}.wav`
    }).then((response) => {
        if (response.data) {
            if (response.data.success) {
                message.transcript = response.data.text
                success = true
            } else {
                success = false
            }
        }
    }).catch((err) => {
        error(err)
    });

    await message.save()

    return [success, message.transcript]
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
    let duration = parseFloat((await getAudioDurationInSeconds(fileName)).toFixed(0))

    try {
        fs.unlinkSync(fileName)
    } catch (err) {
        error(`Fialed to remove file ${err}`)
    }

    if (duration <= 0) throw 'Short audio'

    duration = parseFloat((duration / 60).toFixed(2))


    if (chat.customer.equals(userId)) {

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

    chat.lastMessage = message._id
    await chat.save()

    let m = await Message.findById(message._id).populate({
        path: 'from',
        select: "firstName lastName email username"
    })

    return [true, m.toJSON()]
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
