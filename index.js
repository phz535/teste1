require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  Collection,
  Partials
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const required = [
  "DISCORD_TOKEN",
  "CLIENT_ID",
  "GUILD_ID",
  "TICKET_CATEGORY_ID",
  "LOG_CHANNEL_ID",
  "STAFF_ROLE_ID"
];

const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
  console.error("Variáveis ausentes no .env:", missing.join(", "));
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ],
  partials: [Partials.Channel]
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
for (const file of fs.readdirSync(commandsPath).filter((f) => f.endsWith(".js"))) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.data.name, command);
}

const eventsPath = path.join(__dirname, "events");
for (const file of fs.readdirSync(eventsPath).filter((f) => f.endsWith(".js"))) {
  const event = require(path.join(eventsPath, file));
  if (event.once) client.once(event.name, (...args) => event.execute(...args));
  else client.on(event.name, (...args) => event.execute(...args));
}

client.login(process.env.DISCORD_TOKEN);
