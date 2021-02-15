import {Chat, Message, User} from '../../models/db'
import * as fs from "fs";
import getAudioDurationInSeconds from "get-audio-duration";
import {error} from "../../utils/logging";



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


