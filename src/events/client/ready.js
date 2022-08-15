const { REST } = require("@discordjs/rest");
const { promisify } = require("util");
const { parse } = require("path");
const dc = require("discord.js");
const glob = require("glob");
const PG = promisify(glob);

module.exports = {
    name: "ready",
    once: false,

    async run(client) {
        client.db.createConnection(process.env.MONGO_URL);

        client.user.setPresence({
            activities: [
                {
                    name: "Made by Xperium",
                    type: 3
                }
            ]
        });

        const commandArray = [];

        const perm = Object.keys(require("discord.js").PermissionsBitField.Flags);

        const paths = await PG(`${process.cwd()}/src/commands/**/*.js`);

        for (const path of paths) {
            const command = await require(path);

            if (!command) continue;

            const filter = parse(path);

            command.dir = path;
            command.category = filter.dir.match(/([^\/]*)\/*$/)?.[1] ?? "invalid";

            if (!command.name || !command.description || !command.type || !command.usage)
                return console.log("[COMMAND]".blue + ` Invalid Arguments At ${path}`.white);

            if (command.permission && !perm.includes(command.permission))
                return console.log("[COMMAND]".blue + ` Invalid Permission At ${command.name}`.white);

            if (command.devOnly) command.description = command.description + " (dev Only)";

            client.commands.set(command.name, command);
            commandArray.push(command);
        }

        const rest = new REST({ version: 10 }).setToken(process.env.TOKEN);

        rest.put(dc.Routes.applicationGuildCommands(client.config.bot.id, client.config.bot.guild), {
            body: commandArray
        })
            .then(() => {
                if (commandArray.length)
                    console.log("[Commands]".blue + ` ${commandArray.length} Commands Loaded`.white);
            })
            .catch((err) => console.log(err));
    }
};
