const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autorole-remove')
        .setDescription('Sets a role to auto add to people who join your server')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role you want to set')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),
    async execute(interaction, client) {
        const role = interaction.options.getRole('role');
        const delEmbed = new EmbedBuilder()
            .setColor(0x8fcb8d)
            .setDescription(`${role} has been removed from the autorole list.`)

            await db.delete(`autorole_${interaction.guild.id}`, role.id);
            await interaction.reply({ embeds: [delEmbed] });
    }
}