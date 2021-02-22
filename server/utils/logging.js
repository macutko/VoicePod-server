import chalk from 'chalk';

let currentdate = new Date();
let datetime =
  currentdate.getHours() +
  ':' +
  currentdate.getMinutes() +
  ':' +
  currentdate.getSeconds();

export const log = (text) => {
    console.log(datetime.toString() + chalk.bgWhite.bold(' LOG:') + (' ' + text));
};
export const action = (action, data) => {
    console.log(
        datetime.toString() + chalk.bgCyanBright.bold(' ' + action + ' ' + data)
    );
};
export const negativeAction = (action, data) => {
    console.log(
        datetime.toString() + chalk.bgRedBright.bold(' ' + action + ' ' + data)
    );
};

export const positiveAction = (action, data) => {
    console.log(
        datetime.toString() + chalk.bgGreenBright.bold(' ' + action + ' ' + data)
    );
};

export const error = (text) => {
    console.log(chalk.bgRed.bold(`${Date(Date.now())} Error ${text}`));
};
