module.exports = {
    name: "interactionCreate",
    once: false,

    run(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const cmd = client.commands.get(interaction.commandName);

            if (!cmd)
                return (
                    interaction.reply({
                        embeds: [
                            client
                                .embed()
                                .setColor("#f23a3a")
                                .setTitle("Invalid Command")
                                .setDescription("This Command is not a valid command!\n*Please try again later!*")
                        ],
                        ephemeral: true
                    })
                );
            try {
                if (cmd.devOnly && client.owner != interaction.user.id)
                    return interaction
                        .reply({
                            embeds: [
                                this.embed("failed")
                                    .setTitle("You are not allowed to run this command!")
                                    .setDescription(
                                        `**Only [${this.user.username.toUpperCase()}](${
                                            this.utils.url.support
                                        }) Developers are allowed to run this command!**`
                                    )
                            ],
                            ephemeral: true
                        })
                        .catch(() => null);

                if (cmd.permission && !interaction.member.permissions.has(cmd.permission))
                    return interaction
                        .reply({
                            embeds: [
                                this.embed("failed")
                                    .setTitle("You are not allowed to run this command!")
                                    .setDescription(`Missing Permission: \`${cmd.permission}\``)
                            ],
                            ephemeral: true
                        })
                        .catch(() => null);

                cmd.run(interaction, client);
            } catch (_) {
                console.log(_);

                if (interaction.deferred || interaction.replied) {
                    console.error();
                } else {
                    console.error();
                }
            }
        }
    }
};
