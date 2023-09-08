const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('bans a user')
        .addUserOption(option => option.setName('user').setDescription('The user you would like to ban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('State the reason for banning the user')),
    async execute(interaction, client) {

        const banUser = interaction.options.getUser('user');
        const banMember = await interaction.guild.members.fetch(banUser.id);
        const channel = interaction.channel;

        const embed3 = new EmbedBuilder()
        .setDescription('I cant or you arent allowed to ban this user.')
        .setColor(0x8fcb8d);

        const embed4 = new EmbedBuilder()
        .setDescription('The user is not in the server.')
        .setColor(0x8fcb8d);

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply({ content: 'You are not authorized to execute this command!', ephemeral: true });
        if (!banMember) return await interaction.reply({ embeds: [embed4], ephemeral: true });
        if (!banMember.kickable) return await interaction.reply({ embeds: [embed3], ephemeral: true });

        let reason = interaction.options.getString('reason');
        if (!reason) reason = 'No reason given.';

        const dmEmbed = new EmbedBuilder()
            .setColor(0x8fcb8d)
            .setDescription(`You have been **banned** from ${interaction.guild.name} | ${reason}`)

        const embed = new EmbedBuilder()
            .setColor(0x8fcb8d)
            .setDescription(`${banUser.tag} has been **banned**. | ${reason}`)

        await banMember.send({ embeds: [dmEmbed] }).catch(err => {
            return;
        });

        await banMember.ban({ reason: reason }).catch(err => {
            interaction.reply({ content: 'There was an error with banning this member.', ephemeral: true });
        });

        await interaction.reply({ embeds: [embed] });
    }
};