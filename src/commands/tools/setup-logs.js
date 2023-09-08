const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ChannelType } = require('discord.js');
const logSchema = require('../../models/logs.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-logs')
        .setDescription('Sets up the log channel for the server')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Pick the channel for action logs')
                .setRequired(true)),
    async execute(interaction, client) {
        const { channel, options } = interaction;
        const guildId = interaction.guild.id
        const logChannel = options.getChannel('channel');
        const channelId = logChannel.id
        const embed = new EmbedBuilder()

        logSchema.findOne({ Guild: guildId }, async (err, data) => {
            if (!data) {
                await logSchema.create({
                    Guild: guildId,
                    Channel: logChannel.id
                });

                embed.setDescription('Successfully added the channel to the database.')
                    .setColor(0x8fcb8d)
                    .setTimestamp();
            } else if (data) {
                logSchema.deleteMany({ Channel: channelId }, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });

                embed.setDescription('Successfully removed the channel from the database.')
                    .setColor(0x8fcb8d)
                    .setTimestamp();
            }

            if (err) {
                embed.setDescription('Something went wrong, please join the support server and contact the developer')
                    .setColor(0x171917)
                    .setTimestamp();
            }

            return interaction.reply({ embeds: [embed], ephemeral: true });
        })
    }
};