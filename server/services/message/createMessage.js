import fs from "fs";
import getAudioDurationInSeconds from "get-audio-duration";
import {error} from "../../utils/logging";
import {Message} from "../../models/db";
import {checkChatData} from "./_util";

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
