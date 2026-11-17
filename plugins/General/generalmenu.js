
import fs from 'fs';
import { getSettings } from '../../database/config.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default {
  name: 'generalmenu',
  aliases: ['genmenu'],
  description: 'Displays SHADOW FMX General Menu',

  run: async (context) => {
    const { client, m } = context;
    const fq = getFakeQuoted(m);

    await client.sendMessage(m.chat, {
      react: { text: '⏳', key: m.reactKey }
    });

    // BOT SETTINGS
    const botname = 'SHADOW FMX';
    const settings = await getSettings();
    const effectivePrefix = settings.prefix || '.';

    // FANCY FONT
    const toFancyFont = (text) => {
      const fonts = {
        'a':'𝙖','b':'𝙗','c':'𝙘','d':'𝙙',
        'e':'𝙚','f':'𝙛','g':'𝙜','h':'𝙝',
        'i':'𝙞','j':'𝙟','k':'𝙠','l':'𝙡',
        'm':'𝙢','n':'𝙣','o':'𝙤','p':'𝙥',
        'q':'𝙦','r':'𝙧','s':'𝙨','t':'𝙩',
        'u':'𝙪','v':'𝙫','w':'𝙬','x':'𝙭',
        'y':'𝙮','z':'𝙯'
      };

      return text.toLowerCase()
        .split('')
        .map(char => fonts[char] || char)
        .join('');
    };

    // MENU HEADER
    let menuText = `
╭━━━━━━━━━━━━━━━━━━━━╮
┃    ☠ SHADOW FMX ☠
┃   HACKER GREEN EDITION
╰━━━━━━━━━━━━━━━━━━━━╯

╭━━━『 GENERAL MENU 』
┃
┃ ⚡ Prefix : ${effectivePrefix}
┃ 🤖 Bot : ${botname}
┃ 💚 Status : ONLINE
┃
`;

    // READ COMMANDS
    const commandFiles = fs.readdirSync(
      './plugins/General'
    ).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const commandName = file.replace('.js', '');
      const fancyCommandName = toFancyFont(commandName);

      menuText += `┃ ➤ ${effectivePrefix}${fancyCommandName}\n`;
    }

    // MENU FOOTER
    menuText += `
╰━━━━━━━━━━━━━━━━━━━━╯

   ☠ POWERED BY SHADOW FMX
       HACKER GREEN 💚
`;

    // SEND MENU
    await client.sendMessage(m.chat, {
      text: menuText
    }, {
      quoted: fq
    });

    await client.sendMessage(m.chat, {
      react: { text: '💚', key: m.reactKey }
    });
  }
};
