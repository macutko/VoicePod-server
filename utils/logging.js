import chalk from 'chalk';

export const log = (text) => {

    console.log(chalk.bgWhite.bold(Date(Date.now()).toString() + " LOG:") + (" " + text))
};
export const escaped_chase = (senderUsername, username) => {

    console.log(chalk.bgCyanBright.bold(Date(Date.now()).toString() + " Escaped chase:") + (username + " escaped a chase with:" + senderUsername))
};
export const start_chase = (chaser, target) => {

    console.log(chalk.bgBlueBright.bold(Date(Date.now()).toString() + " Start chase:") + (chaser + " started a chase on user :" + target))
};
export const lost_chase = (loser, chaser) => {

    console.log(chalk.bgRedBright.bold(Date(Date.now()).toString() + " Lost chase:") + (loser + " has lost to " + chaser))
}

export const won_chase = (loser, chaser) => {

    console.log(chalk.bgGreenBright.bold(Date(Date.now()).toString() + " Won chase:") + (chaser + " has won over " + loser))
}

export const error = (text) => {
    console.log(chalk.bgRed.bold(`${Date(Date.now())} Error ${text}`))
};
