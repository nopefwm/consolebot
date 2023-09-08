const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Testing command for testing purposes'),
    async execute(interaction, client) {
        const message = await interaction.deferReply({
            fetchReply: true
        });
        const newMessage = new EmbedBuilder()
            .setTitle('GRAHHHHHHHHH')
            .setDescription(`The bot works!\nNow to address the real problem...`)
            .setColor(0x8fcb8d)
            .setTimestamp(Date.now())
            .setAuthor({
                name: interaction.user.tag
            });

        await interaction.editReply({
            embeds: [newMessage]
        });
    }
};