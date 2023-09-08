const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Returns with ping from server'),
    async execute(interaction, client) {
        const message = await interaction.deferReply({
            fetchReply: true
        });
        const newMessage = new EmbedBuilder()
            .setTitle('Pong!')
            .setDescription(`API Latency: ${client.ws.ping}\nClient Ping: ${message.createdTimestamp - interaction.createdTimestamp}`)
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