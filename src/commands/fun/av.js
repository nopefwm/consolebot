const { SlashCommandBuilder, EmbedBuilder, Embed } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('av')
        .setDescription('Displays user avatar')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The avatar you want to see')
                .setRequired(true)),
    async execute(interaction, client) {
        const user = interaction.options.getUser('user')
        const embed = new EmbedBuilder()
            .setColor(0x8fcb8d)
            .setTitle(`${user.username}'s avatar`)
            .setImage(user.displayAvatarURL({ size: 4096, dynamic: true }))

        await interaction.reply({ embeds: [embed] });
    }
};