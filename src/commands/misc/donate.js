const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('donate')
        .setDescription('Donation information.'),
    async execute(interaction, client) {
        const message = await interaction.deferReply({
            fetchReply: true
        });
        const newMessage = new EmbedBuilder()
            .setTitle('Donation Methods')
            .setDescription(`Paypal: https://www.paypal.com/donate/?hosted_button_id=ARLDH3UW4LGDL `)
            .setColor(0x8fcb8d)
            .setTimestamp(Date.now())
            .setAuthor({
                name: client.user.tag
            })
            .setFooter({
                text: 'Thank you for your help!'
            });

        await interaction.editReply({
            embeds: [newMessage]
        });
    }
};