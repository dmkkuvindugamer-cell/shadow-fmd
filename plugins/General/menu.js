
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import {
    generateWAMessageFromContent,
    proto
} from '@whiskeysockets/baileys';

import { getFakeQuoted } from '../../lib/fakeQuoted.js';
import { getDeviceMode } from '../../lib/deviceMode.js';

export default {
    name: 'menu',

    aliases: [
        'commands',
        'list',
        'cmds',
        'm',
        'cmd',
        'commandlist',
        'allcmds'
    ],

    description: 'Displays SHADOW FMX command menu',

    run: async (context) => {

        const {
            client,
            m,
            mode,
            pict,
            botname,
            prefix
        } = context;

        const fq = getFakeQuoted(m);

        // LOADING REACTION
        await client.sendMessage(m.chat, {
            react: {
                text: '💚',
                key: m.key
            }
        });

        const BOT_NAME = 'SHADOW FMX';
        const effectivePrefix = prefix || '.';

        // COMMAND VALIDATION
        const bodyText = m.body || '';
        const cleanText = bodyText
            .trimStart()
            .slice(effectivePrefix.length)
            .trimStart();

        const firstWord = cleanText
            .split(/\s+/)[0]
            .toLowerCase();

        const validMenuCommands = [
            'menu',
            'commands',
            'list',
            'cmds',
            'm',
            'help',
            'cmd',
            'commandlist',
            'allcmds'
        ];

        if (
            cleanText !== '' &&
            !validMenuCommands.includes(firstWord)
        ) {
            const commandName = cleanText.split(/\s+/)[0];

            return client.sendMessage(m.chat, {
                text: `
╭━━━━━━━━━━━━━━━━━━━━╮
┃     ☠ SHADOW FMX ☠
╰━━━━━━━━━━━━━━━━━━━━╯

⚠ INVALID MENU REQUEST

Hey ${m.pushName || 'User'}!

Unknown menu command:
${commandName}

Please type:
${effectivePrefix}menu

💚 HACKER GREEN EDITION
`
            }, {
                quoted: fq
            });
        }

        // MAIN MENU TEXT
        const menuText = `
╭━━━━━━━━━━━━━━━━━━━━╮
┃     ☠ SHADOW FMX ☠
┃   HACKER GREEN EDITION
╰━━━━━━━━━━━━━━━━━━━━╯

Hey @${m.sender.split('@')[0].split(':')[0]}! 💚

╭━━━『 BOT INFORMATION 』
┃
┃ 🤖 Bot : ${BOT_NAME}
┃ ⚡ Prefix : ${effectivePrefix}
┃ 💻 Mode : ${mode || 'Public'}
┃ 🟢 Status : ONLINE
┃
╰━━━━━━━━━━━━━━━━━━━━

💚 Select a category below.

☠ POWERED BY SHADOW FMX
`;

        // MENU CATEGORIES
        const sections = [

            {
                title: '💚 CORE COMMANDS',
                highlight_label: 'SHADOW FMX',
                rows: [
                    {
                        title: 'Full Menu',
                        description: 'Display all commands',
                        id: `${effectivePrefix}fullmenu`
                    },
                    {
                        title: 'Developer',
                        description: 'Developer contact',
                        id: `${effectivePrefix}dev`
                    },
                    {
                        title: 'Report',
                        description: 'Report a bug',
                        id: `${effectivePrefix}report`
                    }
                ]
            },

            {
                title: '⚡ BOT INFORMATION',
                highlight_label: 'SYSTEM INFO',
                rows: [
                    {
                        title: 'Ping',
                        description: 'Check bot speed',
                        id: `${effectivePrefix}ping`
                    },
                    {
                        title: 'Settings',
                        description: 'Show bot settings',
                        id: `${effectivePrefix}settings`
                    },
                    {
                        title: 'Mode',
                        description: 'Toggle bot mode',
                        id: `${effectivePrefix}mode`
                    },
                    {
                        title: 'Uptime',
                        description: 'Check bot running time',
                        id: `${effectivePrefix}uptime`
                    }
                ]
            },

            {
                title: '☠ CATEGORY MENUS',
                highlight_label: 'HACKER GREEN',
                rows: [
                    {
                        title: 'General Menu',
                        description: 'General commands',
                        id: `${effectivePrefix}generalmenu`
                    },
                    {
                        title: 'Settings Menu',
                        description: 'Bot settings commands',
                        id: `${effectivePrefix}settingsmenu`
                    },
                    {
                        title: 'Owner Menu',
                        description: 'Owner commands',
                        id: `${effectivePrefix}ownermenu`
                    },
                    {
                        title: 'Group Menu',
                        description: 'Group management',
                        id: `${effectivePrefix}groupmenu`
                    },
                    {
                        title: 'AI Menu',
                        description: 'AI and chat commands',
                        id: `${effectivePrefix}aimenu`
                    },
                    {
                        title: 'Download Menu',
                        description: 'Media commands',
                        id: `${effectivePrefix}downloadmenu`
                    },
                    {
                        title: 'Editing Menu',
                        description: 'Media editing tools',
                        id: `${effectivePrefix}editingmenu`
                    },
                    {
                        title: 'Effects Menu',
                        description: 'Text effect commands',
                        id: `${effectivePrefix}effectsmenu`
                    },
                    {
                        title: 'Utils Menu',
                        description: 'Utility commands',
                        id: `${effectivePrefix}utilsmenu`
                    },
                    {
                        title: 'Privacy Menu',
                        description: 'Privacy commands',
                        id: `${effectivePrefix}privacymenu`
                    }
                ]
            }
        ];

        const device = await getDeviceMode();

        // IOS FALLBACK
        if (device === 'ios') {

            await client.sendMessage(m.chat, {
                text: menuText,
                mentions: [m.sender]
            }, {
                quoted: fq
            });

            try {
                await client.sendMessage(m.chat, {
                    listMessage: {
                        title: 'SHADOW FMX MENU',
                        description: 'Select a category.',
                        buttonText: 'Browse Commands',
                        listType: 1,
                        sections: sections.map(section => ({
                            title: section.title,
                            rows: section.rows.map(row => ({
                                title: row.title,
                                description: row.description,
                                rowId: row.id
                            }))
                        })),
                        footer: 'POWERED BY SHADOW FMX'
                    }
                }, {
                    quoted: fq
                });
            } catch (error) {
                console.error('iOS menu fallback:', error);
            }

            return;
        }

        // INTERACTIVE MENU
        try {

            const msg = generateWAMessageFromContent(
                m.chat,

                proto.Message.fromObject({
                    interactiveMessage: {

                        body: {
                            text: menuText
                        },

                        footer: {
                            text: '☠ POWERED BY SHADOW FMX'
                        },

                        header: {
                            hasMediaAttachment: false
                        },

                        contextInfo: {
                            mentionedJid: [m.sender],

                            externalAdReply: {
                                title: BOT_NAME,
                                body: 'HACKER GREEN EDITION 💚',
                                mediaType: 1,
                                thumbnail: pict,
                                mediaUrl: '',
                                sourceUrl: 'https://github.com/',
                                showAdAttribution: false,
                                renderLargerThumbnail: true
                            }
                        },

                        nativeFlowMessage: {

                            messageVersion: 1,

                            buttons: [

                                {
                                    name: 'cta_url',

                                    buttonParamsJson:
                                        JSON.stringify({
                                            display_text: 'GitHub',
                                            url: 'https://github.com/',
                                            merchant_url: 'https://github.com/'
                                        })
                                },

                                {
                                    name: 'single_select',

                                    buttonParamsJson:
                                        JSON.stringify({
                                            title: '💚 Browse Commands',
                                            sections
                                        })
                                }
                            ]
                        }
                    }
                }),

                {
                    userJid: client.user.id
                }
            );

            if (!msg?.key?.id) {
                throw new Error('Message generation failed');
            }

            await client.relayMessage(
                m.chat,
                msg.message,
                {
                    messageId: msg.key.id
                }
            );

        } catch (error) {

            console.error('Interactive menu error:', error);

            // TEXT MENU FALLBACK
            await client.sendMessage(m.chat, {
                text: menuText,
                mentions: [m.sender]
            }, {
                quoted: fq
            });

            try {
                await client.sendMessage(m.chat, {
                    listMessage: {
                        title: 'SHADOW FMX MENU',
                        description: 'Select a category.',
                        buttonText: 'Browse Commands',
                        listType: 1,
                        sections: sections.map(section => ({
                            title: section.title,
                            rows: section.rows.map(row => ({
                                title: row.title,
                                description: row.description,
                                rowId: row.id
                            }))
                        })),
                        footer: 'POWERED BY SHADOW FMX'
                    }
                }, {
                    quoted: fq
                });
            } catch (fallbackError) {
                console.error('List fallback error:', fallbackError);
            }
        }

        // SHADOW AUDIO
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

        if (!audioFolder) return;

        const menuFiles = [
            'menu1.mp3',
            'menu2.mp3',
            'menu3.mp3',
            'menu4.mp3'
        ];

        const possibleFiles = menuFiles
            .map(file => path.join(audioFolder, file))
            .filter(file => fs.existsSync(file));

        if (possibleFiles.length === 0) return;

        const randomFile =
            possibleFiles[
                Math.floor(Math.random() * possibleFiles.length)
            ];

        await new Promise(resolve =>
            setTimeout(resolve, 500)
        );

        try {
            const audioBuffer = fs.readFileSync(randomFile);

            await client.sendMessage(m.chat, {
                audio: audioBuffer,
                ptt: true,
                mimetype: 'audio/mpeg',
                fileName: 'shadow-menu.mp3'
            }, {
                quoted: fq
            });

        } catch (error) {
            console.error('Shadow audio error:', error);
        }
    }
};
