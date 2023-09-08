const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('membercount')
        .setDescription('Returns with the amount of members and bots in the server'),
    async execute(interaction, client) {
        const m1 = interaction.guild.memberCount;
        const newMessage = new EmbedBuilder()
            .setTitle('**Member Count**')
            .setDescription(`${m1}`)
            .setColor(0x8fcb8d)
            .setTimestamp(Date.now())
            .setAuthor({
                name: interaction.user.tag
            });
        await interaction.reply({
            embeds: [newMessage]
        });
    }
};