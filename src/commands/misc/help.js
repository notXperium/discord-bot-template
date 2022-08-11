const {
    ApplicationCommandType,
    ApplicationCommandOptionType,
    ActionRowBuilder,
    SelectMenuBuilder,
    ComponentType,
} = require("discord.js");
const interactionCreate = require("../../events/guild/interactionCreate");

module.exports = {
    name: "help",
    description: "help menu",
    usage: "</help {command}>",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "command",
            description: "command you need help for",
            type: ApplicationCommandOptionType.String,
            autocomplete: true,
            required: true
        }
    ],

    async autocomplete(interaction, client) {
        const focused = interaction.options.getFocused();

        const cmds = [...new Set(client.commands.map((_) => _.name))];

        const filtered = cmds.filter((c) => c.startsWith(focused))

        await interaction.respond(
            filtered.map((c) => ({ name: c, value: c }))
        )
    },

    async run(interaction, client) {
        const command = interaction.options.getString("command");

        const cmd = client.commands.get(command);

        if (!cmd) return interaction.reply({
            embeds: [
                client.embeds().setTitle("Invalid Command!").setDescription(`Cannot find ${command}!`)
            ]
        });

        interaction.reply({
            embeds: [
                client.embed().setTitle(`Help for ${command}!`).setDescription(`
                \`>\`** Name:** ${cmd.name}
                \`>\`** Description:** ${cmd.description}
                \`>\`** Category:** ${cmd.category} \n
                \`>\`** Usage:**  \`\`\`\n${cmd.usage}\`\`\`
                `)
            ]
        })


    }
};