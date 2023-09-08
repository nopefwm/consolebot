const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a user')
        .addUserOption(option => option.setName('user').setDescription('The user you would like to kick').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('State the reason for kicking the user')),
    async execute(interaction, client) {

        const kickUser = interaction.options.getUser('user');
        const kickMember = await interaction.guild.members.fetch(kickUser.id);
        const channel = interaction.channel;

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return await interaction.reply({ content: 'You are not authorized to execute this command!', ephemeral: true });
        if (!kickMember) return await interaction.reply({ content: 'The user is not in the server.', ephemeral: true });
        if (!kickMember.kickable) return await interaction.reply({ content: 'I am not able to kick this user for you.', ephemeral: true });

        let reason = interaction.options.getString('reason');
        if (!reason) reason = 'No reason given.';

        const dmEmbed = new EmbedBuilder()
            .setColor(0x8fcb8d)
            .setDescription(`You have been **kicked** from ${interaction.guild.name} | ${reason}`)

        const embed = new EmbedBuilder()
            .setColor(0x8fcb8d)
            .setDescription(`${kickUser.tag} has been **kicked**. | ${reason}`)

        await kickMember.send({ embeds: [dmEmbed] }).catch(err => {
            return;
        });

        await kickMember.kick({ reason: reason }).catch(err => {
            interaction.reply({ content: 'There was an error with kicking this member', ephemeral: true });
        });

        await interaction.reply({ embeds: [embed] });
    }
};