import {Chat, Message, User} from '../models/db'
import * as fs from "fs";
import {PythonShell} from "python-shell";
import {error, positive_action} from "../utils/logging";


export async function newMessage(data, userID) {
    // check for the user and chat ID
    if (!data.chatId) throw 'Need a chatId!'
    if (!userID) throw 'need a user ID'

    let chat = await Chat.findById(data.chatId)
    if (!chat) throw 'No chat by this ID'

    let user = await User.findById(userID)
    if (!user) throw 'No user by this ID'

    if ((chat.userAccount.toString() !== userID) && (chat.chatWithAccount.toString() !== userID)) throw 'This user isnt part of this chat!'

    let message = new Message({
        from: user.id,
        chatID: chat.id,
        message: data.message
    })

    await message.save()

    return Message.findById(message._id).populate({
        path: 'from',
        select: "firstName lastName email username"
    })
}

export async function getMessages(data, userID) {
    //@TODO: optimize this check!
    if (!data.chatId) throw 'Need chat ID'
    if (!userID) throw 'need a user ID'

    let chat = await Chat.findById(data.chatId)

    if (!chat) throw 'No chat by this ID'

    if ((chat.userAccount.toString() !== userID) && (chat.chatWithAccount.toString() !== userID)) throw 'This user isnt part of this chat!'
    return Message.find({chatID: data.chatId}).populate({
        path: 'from',
        select: "firstName lastName email username"
    });

}


export async function sendingAudioMessage(data, userID) {
    if (!data.chatId) throw 'Need chat ID'
    if (!userID) throw 'need a user ID'
    if (!data.language) throw 'Need language'
    if (!data.sound) throw 'Need a sound'

    // TODO: save the message and what not but skip for now
    let fileName = `${data.chatId}_${userID}.wav`
    let buff = Buffer.from(data.sound, 'base64');
    await fs.writeFileSync(fileName, buff)

    let options = {
        mode: 'text',
        //TODO: amend for production
        args: [fileName, data.language]
    };

    return await new Promise((resolve, reject) => {

        PythonShell.run('services\\py_speech\\speech_to_text.py', options, (err, res) => {
            let message;
            if (err) {
                error(err)
                reject(err)
            }

            if (res) {
                positive_action('Sound Message!', res)
                message = new Message({
                    from: userID,
                    chatID: data.chatId,
                    message: res.join('.'),
                    sound: true,
                    sound_bits: data.sound
                })
                console.log('problem was here')
                message.save()

                resolve(Message.findById(message._id).populate({
                    path: 'from',
                    select: "firstName lastName email username"
                }))
            }
        });
    })


}

export async function getLanguageOptions(data) {
    return ['en-GB', 'en-US', 'sk-SK']
    // return await new Promise((resolve, reject) => {
    //     let options = {
    //         mode: 'text',
    //         //TODO: amend for production
    // TODO: make this function be useful
    //         pythonPath: 'services\\py_speech\\venv\\Scripts\\python.exe',
    //     };
    //
    //     PythonShell.run('services\\py_speech\\get_language_options.py', options, (err, res) => {
    //         if (err) {
    //             error(err)
    //             reject(err)
    //         }
    //         if (res) {
    //             positive_action('Language options!', res)
    //             resolve(res)
    //         }
    //     });
    // })
}