const { Client, Collection } = require("discord.js");
const client = new Client({ intents: 32767 });
const { Token } = require("./config.json");

const Ascii = require("ascii-table");
const { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);

client.commands = new Collection();

client.userSettings = new Collection();

const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");

client.buttons = new Collection();

["events", "commands", "Anti-Crash"].forEach((handler) => {
  require(`./handlers/${handler}`)(client, PG, Ascii);
});

client.filters = new Collection();
client.filtersLog = new Collection();

client.distube = new DisTube(client, {
  emitNewSongOnly: true,
  leaveOnFinish: true,
  youtubeDL: false,
  emitAddSongWhenCreatingQueue: false,
  plugins: [new SpotifyPlugin()],
});
module.exports = client;

client.login(Token);
