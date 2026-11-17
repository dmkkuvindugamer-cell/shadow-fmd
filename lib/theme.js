
import chalk from 'chalk';

export const green = chalk.hex('#00FF41');
export const darkGreen = chalk.hex('#008F11');
export const neon = chalk.hex('#39FF14');
export const white = chalk.hex('#E0FFE0');

export function themeLog(message) {
    console.log(green(`[ SHADOW FMD ] ${message}`));
}

export function themeError(message) {
    console.log(chalk.red(`[ SHADOW FMD ERROR ] ${message}`));
}

export function themeSuccess(message) {
    console.log(neon(`[ SHADOW FMD SUCCESS ] ${message}`));
}

export function themeBanner() {
    console.log(green(`
███████╗██╗  ██╗ █████╗ ██████╗ 
██╔════╝██║  ██║██╔══██╗██╔══██╗
███████╗███████║███████║██║  ██║
╚════██║██╔══██║██╔══██║██║  ██║
███████║██║  ██║██║  ██║██████╔╝
╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝
       SHADOW FMD
     HACKER GREEN THEME
    `));
}
