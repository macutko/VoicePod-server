import chalk from 'chalk';

var currentdate = new Date();
var datetime = currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

export const log = (text) => {
    console.log(datetime.toString() + chalk.bgWhite.bold(" LOG:") + (" " + text))
};
export const action = (action, data) => {

    console.log(datetime.toString() + chalk.bgCyanBright.bold(" " + action + " " + data))
};
export const negative_action = (action, data) => {
    console.log(datetime.toString() + chalk.bgRedBright.bold(" " + action + " " + data))
};

export const positive_action = (action, data) => {

    console.log(datetime.toString() + chalk.bgGreenBright.bold(" " + action + " " + data))
};

export const error = (text) => {
    console.log(chalk.bgRed.bold(`${Date(Date.now())} Error ${text}`))
};
