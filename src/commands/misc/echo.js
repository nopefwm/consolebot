const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription('Replies with your input!')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to echo to')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('input')
                .setDescription('The input to echo back')
                .setRequired(true)),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const input = interaction.options.getString('input');
        if (!channel) {
            return await interaction.reply('Provide a channel to echo to.');
        }
        if (!input) {
            return await interaction.reply('Provide a message to echo.');
        }
        try {
        await channel.send(input);           
        } catch (err) {
            console.log(err);
            await interaction.reply({
                content: 'Please check if the command succeeded, if not, try again later.',
                ephemeral: true,
            })
        }
    }
};
