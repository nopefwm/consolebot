const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Returns information about you')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user you want to look up')
                .setRequired(true)),
    async execute(interaction, client) {
        const user = interaction.options.getUser('user');
        const userId = user.id
        const embed = new EmbedBuilder()
            .setTitle(user.username)
            .setDescription(user.tag)
            .setColor(0x8fcb8d)
            .setImage(user.banner)
            .setThumbnail(user.displayAvatarURL())
            .setTimestamp(Date.now())
            .setFooter({
                text: `Requested by ${interaction.user.username}`
            })
            .addFields([
                {
                    name: 'User ID',
                    value: user.id,
                },
                {
                    name: 'Created at',
                    value: String(user.createdAt),
                    inline: true,
                },
            ]);

        await interaction.reply({
            embeds: [embed]
        });
    },
};