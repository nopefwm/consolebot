const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Returns all commands from bot to your dms'),
    async execute(interaction, client) {
        const button = new ButtonBuilder()
            .setCustomId('help')
            .setLabel('Next Page')
            .setStyle(ButtonStyle.Success)
        const button2 = new ButtonBuilder()
            .setCustomId('help2')
            .setLabel('Previous Page')
            .setStyle(ButtonStyle.Success)

        const newMessage = new EmbedBuilder()
            .setTitle('console')
            .setDescription(`**This is a list of all the commands currently available.** 
            \n**Moderation**

            **ban**: bans a user from the server,

            **unban**: unbans a user, 

            **kick**: kicks a user from the server,

            **mute**: sets a timeout on a user, 

            **unmute**: removes the timeout on a user, 

            **setme**: used in conjunction with ;createverifyrole and ;verifychannel to set up a verification system for the server 
            (**ONLY "/" COMMANDS**), 

            **role**: adds/removes a role from a user (**ONLY "/" COMMANDS**), 

            **autorole**: sets a role to be automatically added to anyone who enters the server (**ONLY "/" COMMANDS**), 

            **verifychannel**: sends a verification message to a specified channel (**ONLY ";" COMMANDS**),

            **ticket**: creates a ticket message for people to open channels to talk to staff (**ONLY "/" COMMANDS**), 

            **clear**: clears a users messages (**ONLY "/" COMMANDS**),

            **createverifyrole**: creates an unverified role, used in conjunction with ;setme and ;verifychannel (**ONLY ";" COMMANDS**),
            
            **setup-logs**: sets the log channel for the server,
            
            **whitelist**: whitelists a user and prevents them from being hit by the antinuke
            
            **antinuke**: enables/disables the antinuke.

            \n**Miscellaneous**

            **test**: Used for testing purposes,

            **echo**: Posts a message in a different channel,

            **donate**: Provides information about donating to the bot developer,

            **membercount**: provides a count of all the members in the server, 

            **info**: provides information about the bot, 

            **ping**: returns the ping of the discord API, 

            **user**: returns information about a specified user, 

            **steal**: steals an emoji from a different server 
            (**ONLY "/" COMMANDS**), 

            **poll**: sends a poll for users to vote on in a specified channel, 

            **servercount**: returns with the amount of servers console bot is in, 

            **av**: returns with an image of the specified user's avatar, 

            **banner**: returns with an image of the specified user's banner,

            **afk**: sets a message for when someone pings you while you are away (**ONLY ";" COMMANDS**).

            \n**Fun**

            **rps**: play rock paper scissors with console 
            (**ONLY "/" COMMANDS**),

            **8ball**: ask console bot a question (**ONLY ";" COMMANDS**),
            
            **cf**: flips a coin.`)
            .setColor(0x8fcb8d)
            .setTimestamp(Date.now())
            .setThumbnail(client.user.displayAvatarURL())
        await interaction.reply({
            embeds: [newMessage],
        });
    }
};


