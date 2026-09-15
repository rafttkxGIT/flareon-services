const { Client } = require('discord.js-selfbot-v13');
const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

const client = new Client();

let config = {
    autoReply: process.env.AUTO_REPLY || 'Welcome!',
    keywords: (process.env.KEYWORDS || 'boost,service').split(',').map(k => k.trim()),
    channelId: process.env.CHANNEL_ID,
    mentionUser: process.env.MENTION_USER || '@flareonalt',
    status: process.env.BOT_STATUS || 'active'
};

const html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Muscle Legends</title><style>*{margin:0;padding:0;box-sizing:border-box}body{background:linear-gradient(135deg,#0f0f0f,#1a1a1a);font-family:Segoe UI,sans-serif;color:#fff;padding:20px;min-height:100vh}.container{max-width:1000px;margin:0 auto;background:#1e1e1e;border:2px solid #ff6b35;border-radius:12px;padding:40px;box-shadow:0 0 40px rgba(255,107,53,.4)}header{text-align:center;margin-bottom:40px;border-bottom:3px solid #ff6b35;padding-bottom:25px}h1{color:#ff6b35;font-size:3em;margin-bottom:8px}label{display:block;margin-bottom:10px;color:#ff6b35;font-weight:bold}input,textarea,select{width:100%;padding:14px;background:#252525;border:2px solid #ff6b35;color:#fff;border-radius:8px;margin-bottom:15px;font-size:1em;font-family:inherit}button{flex:1;padding:16px;font-size:1.1em;font-weight:bold;border:none;border-radius:8px;cursor:pointer;background:linear-gradient(135deg,#ff6b35,#ff8555);color:#000;transition:all .3s}.btn-group{display:flex;gap:15px;margin-top:30px}.status{padding:18px;border-radius:8px;margin-top:25px;display:none;text-align:center;font-weight:bold}.status.success{background:#2d5016;border:2px solid #4caf50;color:#4caf50;display:block}.status.error{background:#5a1a1a;border:2px solid #f44336;color:#ff6b9d;display:block}.section{margin-bottom:20px;padding:15px;background:#252525;border-left:4px solid #ff6b35}.info{font-size:.85em;color:#888;margin-top:8px}.form-row{display:grid;grid-template-columns:1fr 1fr;gap:20px}@media(max-width:768px){.form-row{grid-template-columns:1fr}}</style></head><body><div class="container"><header><h1>💪 MUSCLE LEGENDS</h1><p>Self-Bot Dashboard</p></header><form id="botForm"><div class="section"><label>Bot Status</label><select id="status"><option value="active">🟢 ACTIVE</option><option value="paused">🟡 PAUSED</option></select></div><div class="form-row"><div><label>Channel ID</label><input type="text" id="channelId" placeholder="1234567890"></div><div><label>Mention</label><input type="text" id="mentionUser" placeholder="@user"></div></div><div><label>Keywords (comma-separated)</label><input type="text" id="keywords" placeholder="boost, service"></div><div><label>Auto-Reply Message</label><textarea id="autoReply" style="min-height:120px"></textarea></div><div class="btn-group"><button type="submit">💾 Save Settings</button></div></form><div id="msg" class="status"></div></div><script>const api="/api/config";const form=document.getElementById("botForm");const msg=document.getElementById("msg");async function load(){try{const r=await fetch(api);const d=await r.json();document.getElementById("status").value=d.status||"active";document.getElementById("channelId").value=d.channelId||"";document.getElementById("mentionUser").value=d.mentionUser||"";document.getElementById("keywords").value=(d.keywords||[]).join(", ");document.getElementById("autoReply").value=d.autoReply||""}catch(e){show("Error loading settings","error")}}function show(m,t){msg.textContent=m;msg.className="status "+t;if(t==="success")setTimeout(()=>{msg.style.display="none"},4000)}form.addEventListener("submit",async e=>{e.preventDefault();show("Saving...","success");const s={status:document.getElementById("status").value,channelId:document.getElementById("channelId").value,mentionUser:document.getElementById("mentionUser").value,keywords:document.getElementById("keywords").value.split(",").map(k=>k.trim()),autoReply:document.getElementById("autoReply").value};try{const r=await fetch(api,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});r.ok?show("✅ Settings saved!","success"):show("❌ Error","error")}catch(e){show("❌ Error","error")}});load()</script></body></html>';

app.get('/', (req, res) => {
    res.send(html);
});

app.get('/api/config', (req, res) => {
    res.json(config);
});

app.post('/api/config', (req, res) => {
    const { status, channelId, mentionUser, keywords, autoReply } = req.body;
    if (status) config.status = status;
    if (channelId) config.channelId = channelId;
    if (mentionUser) config.mentionUser = mentionUser;
    if (keywords) config.keywords = keywords;
    if (autoReply) config.autoReply = autoReply;
    res.json({ success: true });
});

client.on('ready', () => {
    console.log('Self-bot ready as ' + client.user.username);
});

client.on('messageCreate', async (message) => {
    if (message.author.id !== client.user.id) return;
    if (config.status !== 'active') return;

    const content = message.content.toLowerCase();
    const hasKeyword = config.keywords.some(kw => content.includes(kw));

    if (hasKeyword) {
        try {
            const channel = await client.channels.fetch(config.channelId);
            const msg = config.mentionUser + '\n**From:** ' + message.author.username + '\n**Msg:** ' + message.content;
            await channel.send(msg);
        } catch (err) {
            console.error(err);
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Running on ' + PORT);
    client.login(process.env.DISCORD_TOKEN);
});
