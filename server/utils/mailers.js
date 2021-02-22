import { createTransport } from 'nodemailer';

import { error } from './logging';
import { Config } from '../config';

let conf = new Config();

let transporter = createTransport(conf.mailConfig);

export const sendNewBug = (subject, text) => {
    if (!subject) throw 'need a subject';
    if (!text) throw 'need a message';

    return new Promise((resolve, reject) => {
        transporter.sendMail(
            { ...conf.mailBugOptions, subject: subject, text: text },
            function(err, info) {
                if (err) {
                    error(err);
                    reject(err);
                } else {
                    console.log('Email sent: ' + info.response);
                    resolve(info);
                }
            }
        );
    });
};
