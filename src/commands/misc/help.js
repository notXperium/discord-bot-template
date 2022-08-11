const {
    ApplicationCommandType,
    ActionRowBuilder,
    SelectMenuBuilder,
    ComponentType,
} = require("discord.js");

module.exports = {
    name: "help",
    description: "help menu",
    type: ApplicationCommandType.ChatInput,

    async run(interaction, client) {
        let dir = [...new Set(client.commands.map((_) => _.category))];

        if (dir.some((_) => _ == "dev")) {
            dir = dir.filter((_) => _ !== "dev");
        }

        const categories = dir.map((_) => {
            const cmds = client.commands
                .filter((x) => x.category === _)
                .map((cmd) => {
                    return {
                        name: cmd.name || "Unknown",
                        description: cmd.description || "Unknown"
                    };
                });
            return {
                category: _,
                commands: cmds
            };
        });

        const start = client
            .embed()
            .setTitle("Help Menu")
            .setThumbnail(client.user.displayAvatarURL({ size: 4096, dynamic: true }))
            .setDescription("Please Choose A Category!");

        const comp = (bool) => [
            new ActionRowBuilder().addComponents(
                new SelectMenuBuilder()
                    .setCustomId("help")
                    .setPlaceholder("Please choose a category!")
                    .setDisabled(bool)
                    .addOptions(
                        categories.map((cmd) => {
                            return {
                                label: format(cmd.category),
                                value: cmd.category.toLowerCase(),
                                description: `Show all commands from category: ${format(cmd.category)}!`,
                                emoji: "▶️" || null
                            };
                        })
                    )
                    .addOptions([
                        {
                            label: "Exit",
                            value: "exit",
                            description: "Close the Help Menu",
                            emoji: "❌" || null
                        }
                    ])
            )
        ];

         interaction.reply({
            embeds: [start],
            components: comp(false)
        });

        const id = interaction.user.id;

        const filter = (interaction) => interaction.user.id === id;

        const collector = await interaction.channel.createMessageComponentCollector({
            filter,
            componentType: ComponentType.SelectMenu,
            time: 10000
        });

        collector.on("collect", async (interaction) => {
            // if (interaction.type != InteractionType.MessageComponent()) return;

            console.log(interaction)
            const id = interaction.values[0];

            if (id === "exit") interaction.deleteReply().catch(() => null);

            const category = categories.find((_) => _.category.toLowerCase() === id);

            if (!category) return;

            interaction
                .update({
                    embeds: [
                        client
                            .embed()
                            .setTitle(format(id) + " Commands")
                            .setThumbnail(client.user.displayAvatarURL({ size: 4096, dynamic: true }))
                            .setDescription(
                                "**Commands:**\n\n" +
                                    category.commands
                                        .map((_) => {
                                            return `**[${format(_.name)}](https://github.com/notXperium)** ➞ ${format(
                                                _.description
                                            )}`;
                                        })
                                        .join("\n")
                            )
                    ]
                })
                .catch(() => null);
        });

        collector.on("end", (interaction) => {
            if (interaction.message) {
                interaction.editReply({
                    embeds: [start],
                    components: comp(true)
                });
                setTimeout(() => {
                    interaction.deleteReply();
                    return;
                }, 60000);
            }
        });
    }
};

function format(_) {
    return `${_[0].toUpperCase()}${_.slice(1).toLowerCase()}`;
}
