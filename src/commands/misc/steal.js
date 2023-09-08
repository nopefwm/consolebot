const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { default: axios } = require('axios')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('steal')
        .setDescription('Steals an emoji from a server and adds it here.')
        .addStringOption(option => option.setName('emoji').setDescription('The emoji you would like to steal.').setRequired(true))
        .addStringOption(option => option.setName('name').setDescription('The name for the emoji you would like to steal.').setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageEmojisAndStickers)) return await interaction.reply({ content: "You are not authorized to execute this command!", ephemeral: true });

        let emoji = interaction.options.getString(`emoji`)?.trim();
        const name = interaction.options.getString('name');

        if (emoji.startsWith("<") && emoji.endsWith(">")) {
            const id = emoji.match(/\d{15,}/g)[0];

            const type = await axios.get(`https://cdn.discordapp.com/emojis/${id}.gif`)
                .then(image => {
                    if (image) return "gif"
                    else return "png"
                }).catch(err => {
                    return "png"
                })

            emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`
        }

        if (!emoji.startsWith("http")) {
            return await interaction.reply({ content: "You are not able to steal this emoji.", ephemeral: true })
        }
        if (!emoji.startsWith("https")) {
            return await interaction.reply({ content: "You are not able to steal this emoji.", ephemeral: true })
        }

        interaction.guild.emojis.create({ attachment: `${emoji}`, name: `${name}` })
            .then(emoji => {
                const embed = new EmbedBuilder()
                    .setColor(0x8fcb8d)
                    .setDescription(`Added ${emoji}, with the name "**${name}**"`)

                return interaction.reply({ embeds: [embed] });
            }).catch(err => {
                interaction.reply({ content: "The server limit for emojis has been reached.", ephemeral: true })
            })
    }
}