const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('setme')
        .setDescription('Sets up the bot for the server')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),
    async execute(interaction, client) {
        const guild = await interaction.guild.fetch();
        const role = guild.roles.cache.find(r => r.name === "ConsoleUnverified");
        if (!role) {
            interaction.reply({ content: 'Create an unverified role using ;createverifyrole.', ephemeral: true });
            return;
        }
        const consolechannel = guild.channels.cache.find(c => c.name === 'console-logs');
        const id = role.id
        const Embed = new EmbedBuilder()
            .setColor(0x8fcb8d)
            .setDescription('The server has been set up! \nPlease allow the unverified role to see the intended channels everytime you run this command.')
        console.log(id)

        if (!consolechannel) {
            interaction.guild.channels.create({
                name: 'console-logs',
                type: 0,
                permissionOverwrites: [{
                    id: interaction.guild.id,
                    SendMessages: false,
                    ViewChannel: false,
                }]
            });
        }
        interaction.guild.channels.cache.forEach(channel => {
            if (channel.type === 0, 2, 5) {
                try {
                    if (!role) return;
                    channel.permissionOverwrites.create(id, {
                        SendMessages: false,
                        ViewChannel: false,
                    })
                } catch (error) {
                    interaction.reply({ content: 'There was a problem with setting up the server! Make sure I have the correct permissions, if not, contact the bot developer.', ephemeral: true });
                }
            } else {
                return;
            }
        });
        interaction.reply({ embeds: [Embed] });
    }
};