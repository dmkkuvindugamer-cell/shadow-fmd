
import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import axios from 'axios';
import {
    herokuAppName,
    getHerokuApiKey
} from '../../config/settings.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

const BOT_NAME = 'SHADOW FMD';

const SENSITIVE = [
    'heroku_api_key',
    'api_key',
    'database_url',
    'session',
    'secret',
    'password',
    'token',
    'private_key',
    'auth',
    'key'
];

function isSensitive(key) {
    const lowerKey = key.toLowerCase();
    return SENSITIVE.some(item => lowerKey.includes(item));
}

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);

        const react = async (emoji) => {
            await client.sendMessage(m.chat, {
                react: {
                    text: emoji,
                    key: m.reactKey
                }
            }).catch(() => {});
        };

        const replyBox = (title, message) => {
            return `╭━━━「 🟢 ${BOT_NAME} 」━━━╮
├ ${title}
├
├ ${message}
╰━━━━━━━━━━━━━━━━━━╯
> ⚡ POWERED BY ${BOT_NAME}`;
        };

        await react('⌛');

        const herokuApiKey = getHerokuApiKey();

        if (!herokuAppName || !herokuApiKey) {
            await react('❌');
            return m.reply(replyBox(
                'CONFIGURATION ERROR',
                'HEROKU_APP_NAME or HEROKU_API_KEY is not configured.'
            ));
        }

        try {
            const response = await axios.get(
                `https://api.heroku.com/apps/${encodeURIComponent(herokuAppName)}/config-vars`,
                {
                    headers: {
                        Authorization: `Bearer ${herokuApiKey}`,
                        Accept: 'application/vnd.heroku+json; version=3'
                    },
                    timeout: 15000
                }
            );

            const configVars = response.data;

            if (
                !configVars ||
                Object.keys(configVars).length === 0
            ) {
                await react('❌');
                return m.reply(replyBox(
                    'NO CONFIG VARS',
                    'No Heroku config variables were found.'
                ));
            }

            let msg = `╭━━━「 🟢 ${BOT_NAME} 」━━━╮
├━━━≫ HEROKU VARS ≪━━━
├
`;

            for (const [key, value] of Object.entries(configVars)) {
                const safeValue = isSensitive(key)
                    ? '🔒 REDACTED'
                    : String(value);

                msg += `├ ${key}: ${safeValue}\n`;
            }

            msg += `╰━━━━━━━━━━━━━━━━━━╯
> ⚡ POWERED BY ${BOT_NAME}`;

            const dmJid =
                typeof m.sender === 'string' &&
                m.sender.endsWith('@s.whatsapp.net')
                    ? m.sender
                    : null;

            if (!dmJid) {
                await react('❌');
                return m.reply(replyBox(
                    'DM ERROR',
                    'Could not resolve your WhatsApp JID. Please use this command from your private chat.'
                ));
            }

            // Send the variables privately.
            await client.sendMessage(
                dmJid,
                { text: msg },
                { quoted: fq }
            );

            await react('✅');

            return m.reply(replyBox(
                'SUCCESS',
                'Heroku variables have been sent to your private chat. 🔒\nSensitive values are always redacted.'
            ));

        } catch (error) {
            await react('❌');

            return m.reply(replyBox(
                'HEROKU API ERROR',
                'Failed to fetch config variables. Check your Heroku app settings and API permissions.'
            ));
        }
    });
};
