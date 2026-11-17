
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { botname } from '../../config/settings.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    name: 'alive',
    aliases: ['bot', 'test', 'isalive', 'status'],
    description: 'Checks if SHADOW FMD is alive',

    run: async (context) => {
        const { client, m, prefix, pict } = context;
        const fq = getFakeQuoted(m);

        const BOT_NAME = botname || 'SHADOW FMD';
        const PREFIX = prefix || '.';

        const header = `╭━━━「 🟢 ${BOT_NAME} 」━━━╮`;
        const footer = `╰━━━━━━━━━━━━━━━━━━╯
⚡ POWERED BY SHADOW FMD`;

        try {
            await client.sendMessage(m.chat, {
                react: { text: '⌛', key: m.reactKey }
            }).catch(() => {});

            const uptime = process.uptime();

            const days = Math.floor(uptime / 86400);
            const hours = Math.floor((uptime % 86400) / 3600);
            const mins = Math.floor((uptime % 3600) / 60);
            const secs = Math.floor(uptime % 60);

            const uptimeStr = `${days}d ${hours}h ${mins}m ${secs}s`;

            const senderNumber = m.sender
                .split('@')[0]
                .split(':')[0];

            const caption = `${header}
│
├── 🟢 *SYSTEM ONLINE*
│
├ 🤖 *Bot:* ${BOT_NAME}
├ 👤 *User:* @${senderNumber}
├ ⚡ *Status:* Alive & Running
├ ⏱️ *Uptime:* ${uptimeStr}
├ 🎨 *Theme:* Hacker Green
├ 🔑 *Prefix:* ${PREFIX}
│
├── 💻 *SYSTEM MESSAGE*
│
├ ${BOT_NAME} is up and running!
├ Type *${PREFIX}menu* to view commands.
│
${footer}`;

            await client.sendMessage(m.chat, {
                react: { text: '🟢', key: m.reactKey }
            }).catch(() => {});

            if (pict && Buffer.isBuffer(pict)) {
                await client.sendMessage(m.chat, {
                    image: pict,
                    caption,
                    mentions: [m.sender]
                }, { quoted: fq });
            } else {
                await client.sendMessage(m.chat, {
                    text: caption,
                    mentions: [m.sender]
                }, { quoted: fq });
            }

            // SHADOW FMD alive voice
            const possibleAudioPaths = [
                path.join(__dirname, '..', 'shadow_med', 'test.mp3'),
                path.join(process.cwd(), 'shadow_med', 'test.mp3'),
                path.join(__dirname, 'shadow_med', 'test.mp3')
            ];

            for (const audioPath of possibleAudioPaths) {
                if (fs.existsSync(audioPath)) {
                    await client.sendMessage(m.chat, {
                        audio: { url: audioPath },
                        ptt: true,
                        mimetype: 'audio/mpeg',
                        fileName: 'shadow-fmd-alive.mp3'
                    }, { quoted: fq });

                    break;
                }
            }

            await client.sendMessage(m.chat, {
                react: { text: '✅', key: m.reactKey }
            }).catch(() => {});

        } catch (error) {
            await client.sendMessage(m.chat, {
                react: { text: '❌', key: m.reactKey }
            }).catch(() => {});

            console.error('SHADOW FMD Alive Error:', error);

            await m.reply(`${header}
│
├── ❌ *SYSTEM ERROR*
│
├ Something went wrong.
├ Error: ${error.message}
│
${footer}`);
        }
    }
};
