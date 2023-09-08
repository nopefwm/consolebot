const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Returns information about the bot'),
    async execute(interaction, client) {
        const message = await interaction.deferReply({
            fetchReply: true
        });
        const newMessage = new EmbedBuilder()
            .setTitle('console')
            .setDescription(`This is a bot written by nope#1000`)
            .setColor(0x8fcb8d)
            .setTimestamp(Date.now())
            .setThumbnail(client.user.displayAvatarURL())
            .addFields([
                {
                    name: 'What is this bot?',
                    value: 'This is an all purpose bot created by nope#1000, made to fit all your needs.',
                    inline: true,
                },
                {
                    name: 'How to use the bot.',
                    value: `This bot has 2 ways to function, through prefix commands and application commands, please use "/help" for more information and commands.`,
                    inline: true,
                },
                {
                    name: 'Donate.',
                    value: 'Donations are completely optional but help keep this bot online, any help would be appreciated. Use /donate for more information.',
                    inline: true,
                },
            ])
            .setFooter({
                text: 'This project is a WIP'
            })

        await interaction.editReply({
            embeds: [newMessage]
        });
    }
};