
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { generateWAMessageFromContent } from '@whiskeysockets/baileys';
import { getSettings } from '../../database/config.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';
import { getDeviceMode } from '../../lib/deviceMode.js';

export default {
    name: 'start',

    aliases: [
        'alive',
        'online',
        'fredi',
        'bot',
        'status',
        'active',
        'check'
    ],

    description: 'Check if SHADOW FMX is alive',

    run: async (context) => {

        const { client, m, mode, pict, text } = context;
        const fq = getFakeQuoted(m);

        // LOADING REACTION
        await client.sendMessage(m.chat, {
            react: { text: '⌛', key: m.reactKey }
        });

        const botname = 'SHADOW FMX';

        // AUDIO FILE SEARCH
        const audioPaths = [
            path.join(__dirname, 'shadow_med'),
            path.join(process.cwd(), 'shadow_med'),
            path.join(__dirname, '..', 'shadow_med')
        ];

        let audioFolder = null;

        for (const folderPath of audioPaths) {
            if (fs.existsSync(folderPath)) {
                audioFolder = folderPath;
                break;
            }
        }

        // RANDOM START AUDIO
        if (audioFolder) {
            const possibleFiles = [];

            for (let i = 1; i <= 10; i++) {
                for (const ext of [
                    '.mp3',
                    '.m4a',
                    '.ogg',
                    '.opus',
                    '.wav'
                ]) {
                    const fullPath = path.join(
                        audioFolder,
                        `menu${i}${ext}`
                    );

                    if (fs.existsSync(fullPath)) {
                        possibleFiles.push(fullPath);
                    }
                }
            }

            if (possibleFiles.length > 0) {
                const randomFile =
                    possibleFiles[
                        Math.floor(Math.random() * possibleFiles.length)
                    ];

                await client.sendMessage(m.chat, {
                    audio: { url: randomFile },
                    ptt: true,
                    mimetype: 'audio/mpeg',
                    fileName: 'shadow-start.mp3'
                }, { quoted: fq });
            }
        }

        // SETTINGS
        const settings = await getSettings();
        const effectivePrefix = settings.prefix || '.';
        const device = await getDeviceMode();

        // START MESSAGE
        const bodyText = `
╭━━━━━━━━━━━━━━━━━━━━╮
┃      ☠ SHADOW FMX ☠
┃    HACKER GREEN EDITION
╰━━━━━━━━━━━━━━━━━━━━╯

⚡ Hey @${m.sender.split('@')[0].split(':')[0]}!

💚 SHADOW FMX is ONLINE!

☠ System Status : ACTIVE
⚡ Bot Status    : ONLINE
💻 Theme         : HACKER GREEN
🔰 Prefix        : ${effectivePrefix}

╭━━━『 QUICK ACTIONS 』
┃
┃ ➤ ${effectivePrefix}menu
┃ ➤ ${effectivePrefix}ping
┃ ➤ ${effectivePrefix}settings
┃ ➤ ${effectivePrefix}uptime
┃
╰━━━━━━━━━━━━━━━━━━━━

☠ POWERED BY SHADOW FMX
💚 HACKER GREEN EDITION
`;

        // IOS DEVICE FALLBACK
        if (device === 'ios') {
            await client.sendMessage(m.chat, {
                text: bodyText
            }, {
                quoted: fq,
                mentions: [m.sender]
            });

            await client.sendMessage(m.chat, {
                react: { text: '💚', key: m.reactKey }
            });

            return;
        }

        // INTERACTIVE MENU
        const msg = generateWAMessageFromContent(
            m.chat,
            {
                interactiveMessage: {
                    body: {
                        text: bodyText
                    },

                    nativeFlowMessage: {
                        messageVersion: 1,

                        buttons: [
                            {
                                name: 'single_select',

                                buttonParamsJson: JSON.stringify({
                                    title: '☠ SHADOW FMX MENU',

                                    sections: [
                                        {
                                            title: '💚 QUICK ACTIONS',

                                            rows: [
                                                {
                                                    title: '📂 Menu',
                                                    description: 'View all bot commands',
                                                    id: `${effectivePrefix}menu`
                                                },
                                                {
                                                    title: '⚡ Ping',
                                                    description: 'Check bot speed',
                                                    id: `${effectivePrefix}ping`
                                                },
                                                {
                                                    title: '⚙️ Settings',
                                                    description: 'Bot configuration',
                                                    id: `${effectivePrefix}settings`
                                                },
                                                {
                                                    title: '⏱️ Uptime',
                                                    description: 'Bot running time',
                                                    id: `${effectivePrefix}uptime`
                                                }
                                            ]
                                        }
                                    ]
                                })
                            }
                        ]
                    }
                }
            },
            {
                quoted: fq
            }
        );

        // SUCCESS REACTION
        await client.sendMessage(m.chat, {
            react: { text: '💚', key: m.reactKey }
        });

        // SEND INTERACTIVE MESSAGE
        await client.relayMessage(
            m.chat,
            msg.message,
            {
                messageId: msg.key.id
            }
        );
    }
};
