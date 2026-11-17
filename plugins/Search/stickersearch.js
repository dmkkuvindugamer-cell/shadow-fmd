
import { getFakeQuoted } from '../../lib/fakeQuoted.js';
import axios from 'axios';
import { Sticker, StickerTypes } from 'wa-sticker-formatter';

export default {
  name: 'stickersearch',
  aliases: ['ss', 'stick', 'stickers'],
  description: 'Search and send GIF stickers using SHADOW FMX',

  run: async (context) => {
    const { client, m, text, botname } = context;
    const fq = getFakeQuoted(m);

    const BOT_NAME = botname || 'SHADOW FMX';
    const PREFIX = '.';

    const header = `╭━━━「 🟢 SHADOW FMX 」━━━╮`;
    const footer = `╰━━━━━━━━━━━━━━━━━━╯
⚡ POWERED BY SHADOW FMX`;

    if (!text) {
      await client.sendMessage(m.chat, {
        react: { text: '❌', key: m.reactKey }
      }).catch(() => {});

      return m.reply(`${header}
│
├── ⚠️ Give me a search term.
├── Example: ${PREFIX}ss dancing cat
│
${footer}`);
    }

    await client.sendMessage(m.chat, {
      react: { text: '⌛', key: m.reactKey }
    }).catch(() => {});

    try {
      // Set your own Tenor API key using an environment variable.
      const tenorApiKey = process.env.TENOR_API_KEY;

      if (!tenorApiKey) {
        throw new Error('TENOR_API_KEY is not configured.');
      }

      const gifResponse = await axios.get(
        'https://tenor.googleapis.com/v2/search',
        {
          params: {
            q: text,
            key: tenorApiKey,
            client_key: 'shadow_fmx',
            limit: 8,
            media_filter: 'gif'
          },
          timeout: 20000
        }
      );

      const results = gifResponse.data?.results || [];

      if (results.length === 0) {
        await client.sendMessage(m.chat, {
          react: { text: '❌', key: m.reactKey }
        }).catch(() => {});

        return m.reply(`${header}
│
├── ❌ No stickers found for "${text}".
├── Try another search term.
│
${footer}`);
      }

      let sent = 0;

      for (let i = 0; i < Math.min(8, results.length); i++) {
        const gifUrl = results[i]?.media_formats?.gif?.url;

        if (!gifUrl) continue;

        const stickerMess = new Sticker(gifUrl, {
          pack: BOT_NAME,
          author: 'SHADOW FMX',
          type: StickerTypes.FULL,
          categories: ['🟢', '⚡'],
          id: `shadow-fmx-${i}`,
          quality: 60,
          background: 'transparent'
        });

        const stickerBuffer = await stickerMess.toBuffer();

        await client.sendMessage(
          m.chat,
          { sticker: stickerBuffer },
          { quoted: fq }
        );

        sent++;
      }

      if (sent === 0) {
        throw new Error('No usable GIF files were returned.');
      }

      await client.sendMessage(m.chat, {
        react: { text: '✅', key: m.reactKey }
      }).catch(() => {});

    } catch (error) {
      await client.sendMessage(m.chat, {
        react: { text: '❌', key: m.reactKey }
      }).catch(() => {});

      console.error('SHADOW FMX Sticker Search Error:', error.message);

      await m.reply(`${header}
│
├── ❌ Failed to fetch stickers.
├── Check your Tenor API key or internet connection.
├── Please try again later.
│
${footer}`);
    }
  }
};
