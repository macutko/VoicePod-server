import {Chat, Message, User} from '../models/db'
import * as fs from "fs";
import {PythonShell} from "python-shell";
import {error, positive_action} from "../utils/logging";

/**
 * Function used to check whether the message operation can happen. Default checks relevant for more endpoints
 * @param data - data passed in by the socket, much have chat id
 * @param userID - user ID decoded from token
 * @returns {Promise<any[]>} - should return relevant chat object and user object
 */

async function checkChatData(data, userID) {
    if (!data.chatId) throw 'Need a chatId!'
    if (!userID) throw 'need a user ID'

    let chat = await Chat.findById(data.chatId)
    if (!chat) throw 'No chat by this ID'

    let user = await User.findById(userID)
    if (!user) throw 'No user by this ID'

    if ((chat.userAccount.toString() !== userID) && (chat.chatWithAccount.toString() !== userID)) throw 'This user isnt part of this chat!'

    return [chat, user]
}

/**
 * Function used by the new message endpoint.
 * @param data
 * @param userID
 * @returns {Promise<unknown>}
 */
async function handleSoundMessage(data, userID) {

    let fileName = `${data.chatId}_${userID}.wav`
    let buff = Buffer.from(data.sound, 'base64');
    await fs.writeFileSync(fileName, buff)

    let options = {
        mode: 'text',
        args: [fileName, 'en-EN']
    };

    return new Promise((resolve, reject) => {

        PythonShell.run('server/services/py_speech/speech_to_text.py', options, (err, res) => {
            fs.unlink(fileName, (e) => {
                error(e)
                if (e) reject(e);
            });

            if (err) {
                error(err)
                reject(err)
            }
            if (res) {
                positive_action('Sound Message!', res)
                resolve(new Message({
                    from: userID,
                    chatID: data.chatId,
                    message: res.join('.'),
                    sound: true,
                    sound_bits: data.sound
                }))
            }
        });
    })

}

/**
 * This endpoint is on a new message - both sound and text
 * @param data - chat and message data, should have data.type to know if this is a sound message or not
 * @param userID - decoded from token
 * @returns {Promise<Query<Document | null, Document>>} - returns the new message once it has been saved in a format ready to append on the client
 */
export async function newMessage(data, userID) {
    let [chat, user] = await checkChatData(data, userID)
    let message;
    if (data.type === 'text') {
        // This means the message is pure text
        message = new Message({
            from: user.id,
            chatID: chat.id,
            message: data.message
        })
    } else if (data.type === 'sound' && data.sound) {
        message = await handleSoundMessage(data, userID)
    } else {
        throw 'Data.type must be defined!'
    }

    await message.save()

    return Message.findById(message._id).populate({
        path: 'from',
        select: "firstName lastName email username"
    })
}

export async function getMessages(data, userID) {
    let [chat, user] = await checkChatData(data, userID)

    return Message.find({chatID: data.chatId}).populate({
        path: 'from',
        select: "firstName lastName email username"
    });

}


//
// export async function getLanguageOptions(data) {
//     return ['en-GB', 'en-US', 'sk-SK']
//     // return await new Promise((resolve, reject) => {
//     //     let options = {
//     //         mode: 'text',
//     //         //TODO: amend for production
//     // TODO: make this function be useful
//     //         pythonPath: 'services\\py_speech\\venv\\Scripts\\python.exe',
//     //     };
//     //
//     //     PythonShell.run('services\\py_speech\\get_language_options.py', options, (err, res) => {
//     //         if (err) {
//     //             error(err)
//     //             reject(err)
//     //         }
//     //         if (res) {
//     //             positive_action('Language options!', res)
//     //             resolve(res)
//     //         }
//     //     });
//     // })
// }