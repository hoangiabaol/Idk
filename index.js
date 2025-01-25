const express = require("express");
const http = require("http");
const mineflayer = require('mineflayer');
const pvp = require('mineflayer-pvp').plugin;
const { pathfinder } = require('mineflayer-pathfinder');
const armorManager = require('mineflayer-armor-manager');
const AutoAuth = require('mineflayer-auto-auth');
const fs = require('fs');
const app = express();

app.use(express.json());
app.get("/", (_, res) => res.sendFile(__dirname + "/index.html"));
app.listen(process.env.PORT || 3000);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.repl.co/`);
}, 224000);

function loadProxies() {
  return fs.existsSync('proxies.txt') 
    ? fs.readFileSync('proxies.txt', 'utf8').split('\n').filter(line => line.trim() !== '')
    : [];
}

function createBots() {
  const botConfigs = [];
  for (let i = 1; i <= 
       10; i++) {
    botConfigs.push({
      username: `Itz_HGBao${i}`,
      authKey: `bot11220${i + 30}`
    });
  }
  return botConfigs;
}

function createBot(config, proxy) {
  const bot = mineflayer.createBot({
    host: 'mbasic1.pikamc.vn',
    port: 15859,
    username: config.username,
    version: false,
    plugins: [AutoAuth],
    AutoAuth: config.authKey,
    proxy: proxy
  });

  bot.loadPlugin(pvp);
  bot.loadPlugin(armorManager);
  bot.loadPlugin(pathfinder);

  bot.once('spawn', () => {
    setInterval(() => {
      bot.chat("nigga p2w");
    }, 9999000);
  });

  bot.on('kicked', console.log);
  bot.on('error', console.log);
  bot.on('end', () => createBot(config, proxy));
}

const botConfigs = createBots();
const proxies = loadProxies();

botConfigs.forEach((config, index) => {
  const proxy = proxies[index % proxies.length] || null;
  createBot(config, proxy);
});