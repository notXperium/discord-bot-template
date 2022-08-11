const { Client, Collection, EmbedBuilder } = require("discord.js");
const Config = require("./structures/json/config.json");
const Database = require("./structures/base/Database");
const embed = require("./structures/json/embed.json");
require("dotenv").config();
const fs = require("fs");

const client = new Client({
    intents: 3276799,
    restTimeOffset: 0
});

client
    .login(process.env.TOKEN)
    .then(() => console.log(`[${client.user.username.toUpperCase()}]`.blue + " Login successful!".white))
    .catch((err) => console.log(err));

client.commands = new Collection();
client.owner = Config.bot.owner;
client.db = new Database();
client.config = Config;
client.embed = () => {
    return new EmbedBuilder().setColor(embed.color).setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ size: 4096, dynamic: true })
    });
};

const handler = fs.readdirSync("./src/structures/handler");

handler.forEach(_ => {
    require(`./structures/handler/${_}`)(client);
});

module.exports = client;
