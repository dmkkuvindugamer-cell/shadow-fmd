
import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import axios from 'axios';
import { herokuAppName, getHerokuApiKey } from '../../config/settings.js';

const BOT_NAME = 'SHADOW FMD';

// Only allow non-sensitive variables.
const ALLOWED_VARS = [
    'NODE_ENV',
    'DEVICE',
    'TZ',
    'DYNO',
    'PORT'
];

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text, prefix } = context;

        const react = async (emoji) => {
            await client.sendMessage(m.chat, {
                react: { text: emoji, key: m.reactKey }
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

        if (m.isGroup) {
            await react('❌');
            return m.reply(replyBox(
                'DM ONLY',
                'Use this command in your private chat, not in groups. 🔒'
            ));
        }

        if (!text?.trim()) {
            await react('❌');
            return m.reply(replyBox(
                'USAGE',
                `Usage: ${prefix || '.'}getvar VAR_NAME\n\nAllowed: ${ALLOWED_VARS.join(', ')}`
            ));
        }

        const varName = text.trim().split(/\s+/)[0].toUpperCase();

        if (!ALLOWED_VARS.includes(varName)) {
            await react('❌');
            return m.reply(replyBox(
                'ACCESS DENIED 🔒',
                'This variable is not on the allowed list.'
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

            const varValue = response.data?.[varName];

            if (varValue === undefined) {
                await react('❌');
                return m.reply(replyBox(
                    'NOT FOUND',
                    `Variable "${varName}" does not exist.`
                ));
            }

            await react('✅');

            return m.reply(replyBox(
                'GETVAR SUCCESS',
                `${varName} = ${String(varValue)}`
            ));

        } catch (error) {
            await react('❌');

            return m.reply(replyBox(
                'HEROKU API ERROR',
                'Failed to fetch the variable. Check your Heroku configuration and API permissions.'
            ));
        }
    });
};
