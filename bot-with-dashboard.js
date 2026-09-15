const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds
    ]
});

let config = {
    autoReply: process.env.AUTO_REPLY || 'Hey! Welcome to Muscle Legends Boost Services!',
    keywords: (process.env.KEYWORDS || 'boost,service,rebirths,help').split(',').map(k => k.trim()),
    channelId: process.env.CHANNEL_ID,
    mentionUser: process.env.MENTION_USER || '@flareonalt service',
    status: process.env.BOT_STATUS || 'active'
};

const dashboardHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>💪 Muscle Legends Bot Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #fff;
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: #1e1e1e;
            border: 2px solid #ff6b35;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 0 40px rgba(255, 107, 53, 0.4);
        }
        header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #ff6b35;
            padding-bottom: 25px;
        }
        h1 {
            color: #ff6b35;
            font-size: 3em;
            margin-bottom: 8px;
            text-shadow: 0 0 20px rgba(255, 107, 53, 0.3);
        }
        .subtitle {
            color: #aaa;
            font-size: 1.1em;
            letter-spacing: 1px;
        }
        .form-group {
            margin-bottom: 25px;
        }
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 25px;
        }
        @media (max-width: 768px) {
            .form-row {
                grid-template-columns: 1fr;
            }
        }
        label {
            display: block;
            margin-bottom: 10px;
            color: #ff6b35;
            font-weight: bold;
            font-size: 1.05em;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        input, textarea, select {
            width: 100%;
            padding: 14px 16px;
            background: #252525;
            border: 2px solid #ff6b35;
            color: #fff;
            border-radius: 8px;
            font-size: 1em;
            font-family: inherit;
            transition: all 0.3s ease;
        }
        input:focus, textarea:focus, select:focus {
            outline: none;
            box-shadow: 0 0 15px rgba(255, 107, 53, 0.6);
            background: #2a2a2a;
        }
        textarea {
            resize: vertical;
            min-height: 150px;
            font-family: 'Courier New', monospace;
            line-height: 1.5;
        }
        .info-text {
            font-size: 0.85em;
            color: #888;
            margin-top: 8px;
            font-style: italic;
        }
        .button-group {
            display: flex;
            gap: 15px;
            margin-top: 30px;
        }
        @media (max-width: 768px) {
            .button-group {
                flex-direction: column;
            }
        }
        button {
            flex: 1;
            padding: 16px 30px;
            font-size: 1.1em;
            font-weight: bold;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .btn-save {
            background: linear-gradient(135deg, #ff6b35 0%, #ff8555 100%);
            color: #000;
        }
        .btn-save:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(255, 107, 53, 0.4);
        }
        .status-message {
            padding: 18px 20px;
            border-radius: 8px;
            margin-top: 25px;
            text-align: center;
            font-weight: bold;
            font-size: 1.05em;
            display: none;
            animation: slideIn 0.3s ease;
        }
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .status-message.success {
            background: linear-gradient(135deg, #2d5016 0%, #3d6b1f 100%);
            border: 2px solid #4caf50;
            color: #4caf50;
            display: block;
        }
        .status-message.error {
            background: linear-gradient(135deg, #5a1a1a 0%, #8b2e2e 100%);
            border: 2px solid #f44336;
            color: #ff6b9d;
            display: block;
        }
        .section-title {
            color: #ff6b35;
            font-size: 1.3em;
            margin: 30px 0 20px 0;
            padding-bottom: 10px;
            border-bottom: 2px solid #ff6b35;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>💪 MUSCLE LEGENDS</h1>
            <p class="subtitle">Live Bot Dashboard</p>
        </header>

        <form id="botForm">
            <h2 class="section-title">🤖 Bot Status</h2>
            <div class="form-row">
                <div class="form-group">
                    <label for="status">Bot State</label>
                    <select id="status">
                        <option value="active">🟢 ACTIVE (Responding to DMs)</option>
                        <option value="paused">🟡 PAUSED (Not Responding)</option>
                        <option value="idle">⚫ IDLE (Offline)</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="channelId">Forward Channel ID</label>
                    <input type="text" id="channelId" placeholder="1234567890">
                    <p class="info-text">Right-click channel → Copy ID</p>
                </div>
            </div>

            <h2 class="section-title">📍 Settings</h2>
            <div class="form-row">
                <div class="form-group">
                    <label for="mentionUser">Mention in Forwards</label>
                    <input type="text" id="mentionUser" placeholder="@flareonalt service">
                </div>
                
                <div class="form-group">
                    <label for="keywords">Keywords (comma-separated)</label>
                    <input type="text" id="keywords" placeholder="boost, service, rebirths, help">
                </div>
            </div>

            <h2 class="section-title">📨 Auto-Reply Message</h2>
            <div class="form-group">
                <label for="autoReply">Auto-Reply Text</label>
                <textarea id="autoReply" placeholder="Type your auto-reply message here..."></textarea>
            </div>

            <div class="button-group">
                <button type="submit" class="btn-save">💾 Save & Apply Settings</button>
            </div>
        </form>

        <div id="statusMessage" class="status-message"></div>
    </div>

    <script>
        const API = '/api/config';
        const form = document.getElementById('botForm');
        const statusMsg = document.getElementById('statusMessage');

        async function loadSettings() {
            try {
                const response = await fetch(API);
                const data = await response.json();

                document.getElementById('status').value = data.status || 'active';
                document.getElementById('channelId').value = data.channelId || '';
                document.getElementById('mentionUser').value = data.mentionUser || '';
                document.getElementById('keywords').value = (data.keywords || []).join(', ');
                document.getElementById('autoReply').value = data.autoReply || '';
            } catch (err) {
                showStatus('Error loading settings', 'error');
            }
        }

        function showStatus(message, type) {
            statusMsg.textContent = message;
            statusMsg.className = 'status-message ' + type;
            if (type === 'success') {
                setTimeout(() => {
                    statusMsg.style.display = 'none';
                }, 4000);
            }
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            showStatus('Saving settings...', 'success');

            const settings = {
                status: document.getElementById('status').value,
                channelId: document.getElementById('channelId').value,
                mentionUser: document.getElementById('mentionUser').value,
                keywords: document.getElementById('keywords').value.split(',').map(k => k.trim()),
                autoReply: document.getElementById('autoReply').value
            };

            try {
                const response = await fetch(API, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(settings)
                });

                if (response.ok) {
                    showStatus('✅ Settings saved! Bot updated in real-time.', 'success');
                } else {
                    showStatus('❌ Error saving settings', 'error');
                }
            } catch (err) {
                showStatus('❌ Connection error', 'error');
            }
        });

        loadSettings();
    </script>
</body>
</html>`;

app.get('/', (req, res) => {
    res.send(dashboardHTML);
});

app.get('/api/config', (req, res) => {
    res.json(config);
});

app.post('/api/config', (req, res) => {
    const { status, channelId, mentionUser, keywords, autoReply } = req.body;

    config.status = status || config.status;
    config.channelId = channelId || config.channelId;
    config.mentionUser = mentionUser || config.mentionUser;
    config.keywords = keywords || config.keywords;
    config.autoReply = autoReply || config.autoReply;

    res.json({ success: true, message: 'Config updated' });
});

client.on('ready', () => {
    console.log('Bot ready');
    client.user.setActivity('Muscle Legends', { type: 'WATCHING' });
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.channel.isDMBased()) return;
    if (config.status !== 'active') return;

    const content = message.content.toLowerCase();
    const hasKeyword = config.keywords.some(kw => content.includes(kw));

    if (hasKeyword) {
        try {
            await message.reply(config.autoReply);
            console.log('Reply sent');

            const channel = await client.channels.fetch(config.channelId);
            const forwarded = config.mentionUser + '\n\n**From:** ' + message.author.username + '\n**Message:** ' + message.content;
            await channel.send(forwarded);
            console.log('Forwarded');
        } catch (err) {
            console.error('Error:', err.message);
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Dashboard running on port ' + PORT);
    client.login(process.env.DISCORD_TOKEN);
});
