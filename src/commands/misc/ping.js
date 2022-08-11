const { ApplicationCommandType } = require("discord.js");

module.exports = {
    name: "ping",
    description: "show bot ping",
    usage: "</ping>",
    type: ApplicationCommandType.ChatInput,

    run(interaction, client) {
        const load = client.embed().setDescription("Loading...");

        interaction.reply({ embeds: [load] });

        setTimeout(() => {
            interaction.editReply({
                embeds: [
                    client
                        .embed()
                        .setTitle("Ping")
                        .setDescription(
                            `**Latency: [${
                                 Date.now() - interaction.createdTimestamp
                            }](https://github.com/notXperium) ms \nApi Ping: [${
                                client.ws.ping
                            }](https://github.com/notXperium) ms**`
                        )
                ]
            });
        }, 1000);
    }
};
