const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('servercount')
        .setDescription('See how many servers console bot is in'),
    async execute(interaction, client) {
        const servercount = client.guilds.cache.size
        const embed = new EmbedBuilder()
            .setTitle('Console bot is in...')
            .setDescription('**' + String(servercount) + '**' + ' servers.')
            .setColor(0x8fcb8d)

        try {
            interaction.reply({ embeds: [embed] })
        } catch (e) {
            console.log(e);
            return;
        }
    }
}