const { SlashCommandBuilder, EmbedBuilder, User } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('banner')
    .setDescription('Displays a banner')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Whose banner do you want to see')
        .setRequired(true)),
  async execute(interaction, client, fetch) {
    const user = interaction.options.getUser('user');
    const userbanner = await user.fetch('banner', { force: true }).then(console.log).catch(console.error);
    if (!user.banner) {
      interaction.reply({ content: 'This user does not have a banner!', ephemeral: true })
      return;
    }
    const userbannerfr = user.banner
    const extension = userbannerfr.startsWith("a_") ? '.gif' : '.png'

    const banner1 = `https://cdn.discordapp.com/banners/${user.id}/${user.banner}${extension}?size=4096`
    const embed = new EmbedBuilder()
      .setTitle(`${user.username}'s banner`)
      .setImage(`${banner1}`)
      .setColor(0x8fcb8d)
      
    await interaction.reply({ embeds: [embed] });
  }
};
