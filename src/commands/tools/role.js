const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Adds or removes a role from a member')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user you want to target')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role you want to target')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageRoles),
    async execute(interaction, client) {
        const user = interaction.options.getMember('user');
        const role = interaction.options.getRole('role');
        const roleID = role.id;
        if (!user.roles.cache.some(r => r.id === roleID)) {
            user.roles.add(roleID);
            const embed = new EmbedBuilder()
                .setColor(0x8fcb8d)
                .setDescription(`The role has been successfully added to ${user}.`)
            interaction.reply({ embeds: [embed] });
        }
        if (user.roles.cache.some(r => r.id === roleID)) {
            user.roles.remove(roleID);
            const embed = new EmbedBuilder()
                .setColor(0x8fcb8d)
                .setDescription(`The role has been successfully removed from ${user}.`)
            interaction.reply({ embeds: [embed] });
        }
    }
};