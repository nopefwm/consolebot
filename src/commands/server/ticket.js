const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, ButtonInteraction, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('This command opens a ticket'),
    async execute(interaction, client) {
        const existingChannel = interaction.guild.channels.cache.find(c => c.name === `ticket-${interaction.user.tag}`)
        if (existingChannel) {
            interaction.reply(`Your channel already exists! ${channel}`);
            return;
        } else {
            const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('button')
                        .setEmoji('📧')
                        .setLabel('Create Ticket')
                        .setStyle(ButtonStyle.Secondary)
                )
            const embed = new EmbedBuilder()
                .setColor(0x8fcb8d)
                .setTitle('Tickets and Support')
                .setDescription('Click the button below to create a ticket.')

            await interaction.reply({ embeds: [embed], components: [button] });

            const collector = await interaction.channel.createMessageComponentCollector();
            collector.on('collect', async i => {
                await i.update({ embeds: [embed], components: [button] });
                const channel = await interaction.guild.channels.create({
                    name: `ticket-${i.user.tag}`,
                    type: ChannelType.GuildText,
                });
                channel.permissionOverwrites.create(i.user.id, { ViewChannel: true, SendMessages: true });
                channel.permissionOverwrites.create(channel.guild.roles.everyone, { ViewChannel: false, SendMessages: false });

                channel.send({ content: `This is your ticket, ${i.user}. Notify an admin to delete this once finished.` });
                i.user.send(`Your ticket in ${i.guild.name} has been created, here it is ${channel}.`).catch(err => {
                    return;
                });
            })
        }
    }
}
