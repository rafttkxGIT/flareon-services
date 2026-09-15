const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds
    ]
});

// Load config from environment
const config = {
    autoReply: process.env.AUTO_REPLY || 'Hey! Welcome to Muscle Legends Boost Services!',
    keywords: (process.env.KEYWORDS || 'boost,service,rebirths,help').split(',').map(k => k.trim()),
    channelId: process.env.CHANNEL_ID,
    mentionUser: process.env.MENTION_USER || '@flareonalt service',
    status: process.env.BOT_STATUS || 'active'
};

client.on('ready', () => {
    console.log(`✅ Bot logged in as ${client.user.tag}`);
    client.user.setActivity('Muscle Legends Boosts 💪', { type: 'WATCHING' });
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.channel.isDMBased()) return;
    if (config.status !== 'active') return;

    const content = message.content.toLowerCase();
    const hasKeyword = config.keywords.some(kw => content.includes(kw));

    if (hasKeyword) {
        try {
            // Send auto-reply
            await message.reply(config.autoReply);
            console.log(`✅ Reply sent to ${message.author.tag}`);

            // Forward to channel
            const channel = await client.channels.fetch(config.channelId);
            const forwarded = `${config.mentionUser}\n\n**From:** ${message.author.username}\n**Message:** ${message.content}`;
            await channel.send(forwarded);
            console.log(`📤 Forwarded to channel`);
        } catch (err) {
            console.error('Error:', err.message);
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
