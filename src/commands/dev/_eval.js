const { ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const { inspect } = require("util");

module.exports = {
    name: "_eval",
    description: "evaluate code",
    usage: "</eval {code}>",
    devOnly: true,
    options: [
        {
            name: "code",
            description: "code to evaluate",
            required: true,
            type: ApplicationCommandOptionType.String
        }
    ],
    type: ApplicationCommandType.ChatInput,

    async run(interaction, client) {
        const start = Date.now();

        const code = interaction.options.getString("code");

        try {
            const result = await eval(code);

            let output = result;

            if (typeof result !== "string") {
                output = inspect(result);
            }

            interaction.reply({
                embeds: [client.embed().setDescription("Loading...")]
            });

            setTimeout(() => {
                interaction.editReply({
                    embeds: [
                        client
                            .embed()
                            .setTitle("Evaluation Results")
                            .setDescription(
                                `*Executed in ${Math.round(Date.now() - start)}ms!*\n\`\`\`js\n${output}\`\`\``
                            )
                            .setColor("#debb47")
                    ]
                });
            }, 1000);
        } catch (e) {
            interaction.reply({
                embeds: [
                    client
                        .embed()
                        .setTitle("⚠️There was an error!⚠️")
                        .setDescription(`\n\n**Error:** ${e.name} \n\`\`\`${e.message}\`\`\``)
                        .setColor("#f23a3a")
                ],
                ephemeral: true
            });
        }
    }
};
