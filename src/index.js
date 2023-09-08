const { Client, Collection, Events, PermissionsBitField, EmbedBuilder, Partials, PermissionFlagsBits, AuditLogEvent, time, ButtonBuilder, ActionRowBuilder, ButtonStyle, AttachmentBuilder, roleMention } = require("discord.js");
const axios = require('axios');
const process = require('node:process');




require('dotenv').config();
const TOKEN = process.env.TOKEN;


const { QuickDB } = require("quick.db");
const db = new QuickDB

const wlModel = require('./models/whitelist.js');
const anModel = require('./models/antinuke.js');
const afkModel = require('./models/afkSchema.js');
const fmModel = require('./models/lastfm.js');


const client = new Client({
    intents: 131071,
    partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User, Partials.GuildMember, Partials.GuildScheduledEvent, Partials.ThreadMember],
});

// warning ---------------------------------------------------------------------------------------------------------------------------------


process.on('warning', (warning) => {
    console.warn(warning.name);    // Print the warning name
    console.warn(warning.message); // Print the warning message
    console.warn(warning.stack);   // Print the stack trace
  });


// command handler -------------------------------------------------------------------------------------------------------------------------

const fs = require('fs');

const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
    const functionFiles = fs.readdirSync(`./src/functions/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of functionFiles) require(`./functions/${folder}/${file}`)(client);

}

// client function calls ------------------------------------------------------------------------------------------------------------------
const { handleLogs } = require('./logs/handleLogs.js');
const Database = require("better-sqlite3");
client.commands = new Collection();
client.commandArray = [];
client.handleEvents();
client.handleCommands();
handleLogs(client);
client.login(TOKEN);

// interaction create  -------------------------------------------------------------------------------------------------------------------------

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.isChatInputCommand()) {
        const { commands } = client;
        const { commandName } = interaction;
        const command = commands.get(commandName)
        if (!command) return;

        try {
            command.execute(interaction, client);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: `This command has not been executed properly, please try again.`,
                ephemeral: true
            });
        }
    } else if (interaction.isButton()) {
        const { buttons } = client;
        const { customId } = interaction;
        const button = buttons.get(customId);
        if (!button) return new Error(`There is no code for this button.`)

        try {
            await button.execute(interaction, client);
        } catch (err) {
            console.error(err);
        }
    }
});

// auto role -----------------------------------------------------------------------------------------------------------------------------------

client.on(Events.GuildMemberAdd, async (member) => {
    const role = await db.get(`autorole_${member.guild.id}`);
    if (!role) return;
    const giveRole = await member.guild.roles.cache.get(role)

    if (!giveRole) return;
    member.roles.add(giveRole);
})


// reaction snipe ---------------------------------------------------------------------------------------------------------------------------------

const reactionSnipes = {};
client.on('messageReactionRemove', (reaction, user) => {
    reactionSnipes.reaction = reaction.emoji;
    reactionSnipes.message = reaction.message;
    reactionSnipes.user = user.username;
});

// message snipe ----------------------------------------------------------------------------------------------------------------------------------

const snipes = {};
client.on(Events.MessageDelete, (message, user) => {
    if (message.author?.bot) return;
    snipes.message = message.content;
    if (!message.author?.username) return;
    snipes.user = message.author.username;

})


client.on(Events.MessageCreate, async (message) => {


    // prefix commands -----------------------------------------------------------------------------------------------------------------------------


    if (message.author.bot || !message.guild) return;
    let prefix = await db.get(`prefix_${message.guild.id}`)
    if (prefix == null) prefix = ';';

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    // moderation ----------------------------------------------------------------------------------------------------------------------------------


    if (command === 'kick') {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.slice(0).join('' || x.username === args[0]));

        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return message.channel.send("You are not authorized to execute this command!");
        if (!member) return message.channel.send("You must specify someone to kick in this command.");
        if (message.member === member) return message.channel.send("You can't kick yourself silly!");
        if (!member.kickable) return message.channel.send("I am or you aren't high enough to kick this person!");


        let reason1 = args.slice(1).join(" ") || "No reason given."

        const embed = new EmbedBuilder()
            .setColor(0x171917)
            .setDescription(`${member.user.tag} has been **kicked**. | ${reason1}`)

        const dmEmbed = new EmbedBuilder()
            .setColor(0x171917)
            .setDescription(`You have been **kicked** from ${message.guild.name} | ${reason1}`)

        member.send({ embeds: [dmEmbed] }).catch(err => {
            console.log(`${member.user.tag} has their DMs off and cannot recieve the kick message.`);
        })

        member.kick().catch(err => {
            message.channel.send("There was an error kicking this member.");
        })
        message.channel.send({ embeds: [embed] });
    }

    if (command === 'ban') {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.slice(0).join('' || x.username === args[0]));

        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return message.channel.send("You are not authorized to execute this command!");
        if (!member) return message.channel.send("You must specify someone to ban in this command.");
        if (message.member === member) return message.channel.send("You can't ban yourself silly!");
        if (!member.kickable) return message.channel.send("I am or you aren't high enough to ban this person!");


        let reason1 = args.slice(1).join(" ") || "No reason given."

        const embed = new EmbedBuilder()
            .setColor(0x171917)
            .setDescription(`${member.user.tag} has been **banned**. | ${reason1}`)

        const dmEmbed = new EmbedBuilder()
            .setColor(0x171917)
            .setDescription(`You have been **banned** from ${message.guild.name} | ${reason1}`)

        member.send({ embeds: [dmEmbed] }).catch(err => {
            console.log(`${member.user.tag} has their DMs off and cannot recieve the ban message.`);
        })

        member.ban().catch(err => {
            message.channel.send("There was an error banning this member.");
        })
        message.channel.send({ embeds: [embed] });
    }

    if (command === 'unban') {
        const member = args[0];

        let reason2 = args.slice(1).join(" ") || `No reason given.`;

        const embed1 = new EmbedBuilder()
            .setColor(0x171917)
            .setDescription(`<@${member}> has been **unbanned**. | ${reason2}`)

        message.guild.bans.fetch()
            .then(async bans => {
                if (bans.size == 0) return message.channel.send(`There is no one banned in this server just yet.`)

                let bannedId = bans.find(ban => ban.user.id == member);
                if (!bannedId) return await message.channel.send(`This person is not banned from this server.`);

                await message.guild.bans.remove(member, reason2).catch(err => {
                    return message.channel.send("There was an error unbanning this member.");
                })

                await message.channel.send({ embeds: [embed1] });
            })
    }

    if (command === 'mute') {

        const ms = require('ms');
        const user = message.mentions.members.first();
        if (!user) { message.channel.send('Specify a user to mute.') };
        if (user === roleMention) return;
        const member = message.guild.members.cache.get(user.id);
        const time = args.slice(1, 3).join(' ');
        const reason = args.slice(3, 4000).join(' ');
        const convertedTime = ms(time);

        const errEmbed = new EmbedBuilder()
            .setDescription('The command did not execute, please try again later. Reasons: ')
            .setColor(0xc72c3b)




        if (!reason) {
            const succesEmbed1 = new EmbedBuilder()
                .setTitle("**Muted**")
                .setDescription(`Muted **${user}**. \n\n**Duration:** ${time}`)
                .setColor(0x5fb041)
                .setTimestamp();

            if (!message.author.fetchFlags(PermissionFlagsBits.ModerateMembers))
                return message.channel.send({ embeds: [errEmbed], ephemeral: true });

            if (!convertedTime)
                return message.channel.send({ embeds: [errEmbed], ephemeral: true });

            if (member.permissions.has(PermissionsBitField.Flags.Administrator))
                return message.channel.send({ embeds: [errEmbed], ephemeral: true });
            try {
                await member.timeout(convertedTime);
                message.channel.send({ embeds: [succesEmbed1] });
            } catch (err) {
                console.log(err);
            }
        } else {
            const succesEmbed = new EmbedBuilder()
                .setTitle("**Muted**")
                .setDescription(`Muted **${user}**. \n\n**Duration:** ${time} \n\n**Reason:** ${reason} `)
                .setColor(0x5fb041)
                .setTimestamp();
            if (!message.author.fetchFlags(PermissionFlagsBits.ModerateMembers))
                return message.channel.send({ embeds: [errEmbed], ephemeral: true });

            if (!convertedTime)
                return message.channel.send({ embeds: [errEmbed], ephemeral: true });

            if (member.permissions.has(PermissionsBitField.Flags.Administrator))
                return message.channel.send({ embeds: [errEmbed], ephemeral: true });
            try {
                await member.timeout(convertedTime, reason);
                message.channel.send({ embeds: [succesEmbed] });
            } catch (err) {
                console.log(err);
            }
        }
    }


    if (command === 'unmute') {
        const user = message.mentions.members.first();
        const member = message.guild.members.cache.get(user.id);

        const errEmbed = new EmbedBuilder()
            .setDescription('The command did not execute, please try again later.')
            .setColor(0xc72c3b)

        const succesEmbed = new EmbedBuilder()
            .setTitle("**Unmuted**")
            .setDescription(`Succesfully unmuted ${user}.`)
            .setColor(0x5fb041)
            .setTimestamp();

        if (!message.author.fetchFlags(PermissionFlagsBits.ModerateMembers))
            return message.channel.send({ embeds: [errEmbed], ephemeral: true });

        try {
            await member.timeout(null);

            message.channel.send({ embeds: [succesEmbed] });
        } catch (err) {
            console.log(err);
        }
    }

    if (command === 'rs') {
        try {
            const embed = new EmbedBuilder()
                .setTitle(reactionSnipes.user)
                .setDescription(`reacted with ${reactionSnipes.reaction}`)
                .setTimestamp()

            message.channel.send({ embeds: [embed] });
        } catch (e) {
            console.log(e);
        }

    }

    if (command === 's') {
        try {
            const embed = new EmbedBuilder()
                .setTitle(snipes.user)
                .setDescription(`**${snipes.message}**`)
                .setTimestamp()

            message.channel.send({ embeds: [embed] })
        } catch (e) {
            console.log
        }
    }

    // antinuke --------------------------------------------------------------------------------------------------------------------------------------


    if (command === 'antinuke') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return message.channel.send("You are not authorized to execute this command!");
        await anModel.findOne({ GuildID: message.guild.id }, async (err, data) => {
            try {
                if (!data) {
                    await anModel.create({
                        GuildID: message.guild.id,
                        Active: true
                    });
                } else if (data.Active) {
                    data.Active = false;
                    data.save();
                    return message.channel.send({ content: `Antinuke is now disabled.` });
                } else {
                    data.Active = true;
                    data.save();
                }
                return message.channel.send({ content: `Antinuke is now enabled.` });
            } catch (e) {
                console.log(e);
            }
        }).clone();
    }

    if (command === 'whitelist') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return message.channel.send("You are not authorized to execute this command!");
        const user = message.mentions.members.first()
        if (!user) {
            return message.channel.send('Specify a user to whitelist.');
        }
        await wlModel.findOne({ GuildID: message.guild.id, UserID: user.id }, async (err, data) => {
            try {
                if (!data) {
                    await wlModel.create({
                        GuildID: message.guild.id,
                        UserID: user.id,
                        Whitelisted: true
                    });
                } else if (data.Whitelisted) {
                    data.Whitelisted = false
                    data.save();
                    return message.channel.send({ content: `${user} is no longer whitelisted.` });
                } else {
                    data.Whitelisted = true;
                    data.save();
                }
                return message.channel.send({ content: `${user} is now whitelisted.` });
            } catch (e) {
                console.log(e);
            }
        }).clone();
    }


    // verification ---------------------------------------------------------------------------------------------------------------------------------


    if (command === 'createverifyrole') {
        const role = message.guild.roles.cache.find(r => r.name === "ConsoleUnverified");
        const guild = message.guild;
        const guildId = guild.id;
        if (!role) {
            guild.roles.create({
                name: 'ConsoleUnverified',
                color: 0x000000,
                permissions: []
            }).then(role => {
                console.log(`Created role for guild:${guild}`)
            }).catch(console.error);
        } else {
            return message.channel.send(`Role has already been made/renamed. '${role.name}'`);
        }
    }

    if (command === 'verifychannel') {
        const channel = message.mentions.channels.first();
        if (!channel) return message.channel.send("Provide a channel to verify in.");
        channelname = channel.name;
        const channelId = channel.id
        const role = message.guild.roles.cache.find(r => r.name === "ConsoleUnverified");
        if (!role) return message.channel.send("Run ;createverifyrole prior to executing this command.");
        const id = role.id

        const embed = new EmbedBuilder()
            .setTitle('Verify Here.')
            .setColor(0x171917)
            .setDescription(`React to enter the server. \nIn the case of the reaction not working, please contact a staff member \nor join the support server below.`)
            .setTimestamp()
            .setFooter({ text: 'Support Server: https://discord.gg/nopefwm' })

        message.guild.channels.cache.forEach(channel => {
            if (channel.name === channelname) {
                channel.permissionOverwrites.create(id, {
                    SendMessages: false,
                    ViewChannel: true,
                })
                channel.permissionOverwrites.edit(id, {
                    SendMessages: false,
                    ViewChannel: true,
                })
            }
        })

        channel.send({ embeds: [embed] }).then(botsMessage => botsMessage.react('✅'));

    }


    // misc -----------------------------------------------------------------------------------------------------------------------------------------


    if (command === 'test') {
        console.log('The bot works lmao.');
        message.channel.send("The bot works lmao.");
    }

    if (command === 'afk') {
        await afkModel.findOne({ Guild: message.guild.id, UserID: message.author.id }, async (err, data) => {
            try {
                if (!data) {
                    await afkModel.create({
                        Guild: message.guild.id,
                        Time: message.createdAt,
                        UserID: message.author.id,
                        Afk: true
                    });
                } else if (data.Afk) {
                    data.Afk = false;
                    data.save();
                } else {
                    data.Time = message.createdAt;
                    data.Afk = true;
                    data.save();
                }
                return message.reply({ content: 'You are now AFK.' });
            } catch (e) {
                console.log(e);
            }
        }).clone();

    }

    if (command === 'echo') {
        const channel = message.mentions.channels.first();
        const m = args.slice(1).join(" ");

        if (!channel) return message.channel.send("Provide a channel to echo to.");
        if (!m) return message.channel.send("Provide a message to echo.");

        channel.send(m);
        message.react("✅").catch(err => {
            return;
        });
    }

    if (command === 'donate') {
        const newMessage = new EmbedBuilder()
            .setTitle('Donation Methods')
            .setDescription(`Paypal: https://www.paypal.com/donate/?hosted_button_id=ARLDH3UW4LGDL `)
            .setColor(0x8fcb8d)
            .setTimestamp(Date.now())
            .setAuthor({
                name: client.user.tag
            })
            .setFooter({
                text: 'Thank you for your help!'
            });

        await message.channel.send({
            embeds: [newMessage]
        });
    }

    if (command === 'info') {
        const newMessage = new EmbedBuilder()
            .setTitle('console')
            .setDescription(`This is a bot written by nope#1000 \n\n**What is this bot?** \nThis is an all purpose bot created by nope#1000, made to fit all your needs. \n\n**How to use the bot.** \nThis bot has 2 ways to function, through prefix commands and application commands, please use ";help" for more information and commands. \n\n**Donate...** \nDonations are completely optional but help keep this bot online, any help would be appreciated. Use /donate for more information.`)
            .setColor(0x8fcb8d)
            .setTimestamp(Date.now())
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter({
                text: 'This project is a WIP'
            })

        await message.channel.send({
            embeds: [newMessage]
        });
    }

    if (command === 'ping') {
        const newMessage = new EmbedBuilder()
            .setTitle('Pong!')
            .setDescription(`API Latency: ${client.ws.ping}`)
            .setColor(0x8fcb8d)
            .setTimestamp(Date.now())
            .setAuthor({
                name: message.author.username
            });

        await message.channel.send({
            embeds: [newMessage]
        });
    }

    if (command === 'user') {
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.slice(0).join('' || x.username === args[0]));

        if (user) {
            const embed = new EmbedBuilder()
                .setTitle(user.displayName)
                .setDescription(`ID: ${user.id} \nJoined at: ${user.joinedAt}`)
                .setColor(0x8fcb8d)
                .setThumbnail(user.displayAvatarURL())
                .setTimestamp(Date.now())
                .setFooter({
                    text: `Requested by ${message.author.username}`
                })


            await message.channel.send({
                embeds: [embed]
            })
        } else {
            const embed = new EmbedBuilder()
                .setTitle(message.author.tag)
                .setDescription(`ID: ${message.author.id} \nCreated at: ${String(message.author.createdAt)}`)
                .setColor(0x8fcb8d)
                .setThumbnail(message.author.displayAvatarURL())
                .setTimestamp(Date.now())
                .setFooter({
                    text: `Requested by ${message.author.username}`
                })


            await message.channel.send({
                embeds: [embed]
            })
        }
    }

    if (command === 'av') {
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.slice(0).join('' || x.username === args[0]));
        if (!user) {
            const embed = new EmbedBuilder()
                .setColor(0x8fcb8d)
                .setTitle(`${message.author.username}'s avatar`)
                .setImage(message.author.displayAvatarURL({ size: 4096, dynamic: true }))
            await message.channel.send({ embeds: [embed] });
        }
        if (user) {
            const username = await user.fetch({ force: true }).catch(console.error);
            const embed = new EmbedBuilder()
                .setColor(0x8fcb8d)
                .setTitle(`${user.displayName}'s avatar`)
                .setImage(user.displayAvatarURL({ size: 4096, dynamic: true }))
            await message.channel.send({ embeds: [embed] });
        }
    }

    if (command === 'banner') {
        const user = message.mentions.members.first();
        if (!user) {
            try {
                const data = await axios.get(`https://discord.com/api/users/${message.author.id}`, {
                    headers: {
                        Authorization: `Bot ${process.env.TOKEN}`
                    }
                }).then(d => d.data);
                if (!data.banner) {
                    message.channel.send({ content: 'This user does not have a banner!' });
                } else {
                    let url = data.banner.startsWith('a_') ? ".gif?size=4096" : '.png?size=4096'
                    url = `https://cdn.discordapp.com/banners/${message.author.id}/${data.banner}${url}`
                    const embed = new EmbedBuilder()
                        .setTitle(`${message.author.username}'s banner`)
                        .setImage(`${url}`)
                        .setColor(0x8fcb8d)
                    message.channel.send({ embeds: [embed] })
                }
            } catch (e) {
                message.channel.send({ content: 'This user does not have a banner!' });
            }
        } else {
            try {
                const data = await axios.get(`https://discord.com/api/users/${user.id}`, {
                    headers: {
                        Authorization: `Bot ${process.env.TOKEN}`
                    }
                }).then(d => d.data);
                if (!data.banner) {
                    message.channel.send({ content: 'This user does not have a banner!' });
                } else {
                    let url = data.banner.startsWith('a_') ? ".gif?size=4096" : '.png?size=4096'
                    url = `https://cdn.discordapp.com/banners/${user.id}/${data.banner}${url}`
                    const embed = new EmbedBuilder()
                        .setTitle(`${user.displayName}'s banner`)
                        .setImage(`${url}`)
                        .setColor(0x8fcb8d)
                    message.channel.send({ embeds: [embed] })
                }
            } catch (e) {
                message.channel.send({ content: 'This user does not have a banner!' });
            }
        }
    }


    // server ---------------------------------------------------------------------------------------------------------------------------------------


    if (command === 'membercount') {
        const m1 = message.guild.memberCount;

        const embed2 = new EmbedBuilder()
            .setColor(0x171917)
            .setTitle('Member Count')
            .setDescription(`**Member Count:** ${m1}`)

        message.channel.send({ embeds: [embed2] });
    }

    if (command === 'prefix') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.channel.send('You are not authorized to execute this command!');

        const prefix = args[0];
        if (!prefix) {
            return message.channel.send('Provide the new prefix.');
        }
        const newPrefix = await db.set(`prefix_${message.guild.id}`, prefix)
        const embed = new EmbedBuilder()
            .setColor(0x171917)
            .setDescription(`The prefix has been changed to **${newPrefix}**`)

        message.channel.send({ embeds: [embed] });
    }

    if (command === 'defaultprefix') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.channel.send('You are not authorized to execute this command!');

        const prefix = ';';
        const embed = new EmbedBuilder()
            .setColor(0x171917)
            .setDescription(`The prefix has been changed back to **;**`)

        await db.set(`prefix_${message.guild.id}`, prefix)

        message.channel.send({ embeds: [embed] });

    }

    if (command === 'servercount') {
        const servercount = client.guilds.cache.size
        const embed = new EmbedBuilder()
            .setTitle('Console bot is in...')
            .setDescription('**' + String(servercount) + '**' + ' servers.')
            .setColor(0x8fcb8d)

        try {
            message.channel.send({ embeds: [embed] })
        } catch (e) {
            console.log(e);
            return;
        }
    }


    // fun -------------------------------------------------------------------------------------------------------------------------------------------


    if (command === '8ball') {
        if (!args[0]) {
            return message.channel.send('Please ask me a question.');
        } else {
            message.channel.sendTyping();
            let eightball = [
                'It is certain.',
                'It is decidedly so.',
                'Without a doubt.',
                'Yes definitely.',
                'You may rely on it.',
                'As I see it, yes.',
                'Most likely.',
                'Outlook good.',
                'Yes.',
                'Signs point to yes.',
                'Don\'t count on it.',
                'My reply is no.',
                'My sources say no.',
                'Outlook not so good.',
                'Very doubtful.',
                'No way.',
                'Maybe',
                'No.',
                '||No||',
                '||Yes||',
                'Hang on',
                'It\'s over',
                'It\'s 4 in the morning',
                'Good Luck',
                'I am the best',
                'Nerd',
                'skull',
                `$ma`,
                '<@518529472983728157> who are you?'

            ];
            let index = (Math.floor(Math.random() * Math.floor(eightball.length)));
            setTimeout(() => {
                message.channel.send({
                    content: eightball[index],
                });
            }, 750);
        }
    }

    if (command === 'cf') {
        const user = message.author;
        let cf = ['Heads', 'Tails'];
        let result = cf[Math.floor(Math.random() * cf.length)];
        message.channel.send('<@' + user + '>' + `: The result is '${result}'`)
    }

    if (command === 'dice') {
        const diceRoll = Math.floor(Math.random() * 6) + 1;
        message.channel.send(`You rolled a ${diceRoll}`);
    }
});



// verification react -----------------------------------------------------------------------------------------------------------------------


client.on(Events.MessageReactionAdd, async (reaction, user) => {


    if (user.bot) return;

    const userId = reaction.message.guild.members.cache.get(user.id);
    const userReactions = reaction.message.fetch(reaction => reaction.users.cache.has(userId));

    const verifyrole = reaction.message.guild.roles.cache.find(r => r.name === "ConsoleUnverified");
    if (!verifyrole) return;


    if (reaction.partial) {
        try {
            await reaction.fetch();
            console.log('reaction has been fetched');
            client.on(Events.MessageReactionAdd, async () => {
                reaction.message.guild.members.cache.get(user.id).roles.remove(verifyrole);
            })
        } catch (error) {
            console.error('Something went wrong when fetching the message:', error);
            return;
        }
    }
})


// afk remove -------------------------------------------------------------------------------------------------------------------------------

client.on(Events.MessageCreate, (message) => {

    message.guild.members.fetch();
    const user1 = message.mentions.members.first();
    const reason = message.content.split(';afk').slice(1, 4000);

    afkModel.findOne({ Guild: message.guild?.id, UserID: message.author.id }, async (err, data) => {
        if (data?.Afk) {
            data.Afk = false;
            data.save();
            const date = new Date(data.Time);
            const shortDate = time(date, 'f');
            const relative = time(date, 'R');
            return message.reply({ content: `You are no longer AFK. AFK since: ` + shortDate + relative });
        }
        return;
    });

    const taggedMembers = message.mentions.users.map(msg => msg.id);
    if (taggedMembers.length > 0) {
        if (message.author.bot) {
            return;
        }
        taggedMembers.forEach(m => {
            afkModel.findOne({ Guild: message.guild.id, UserID: m }, async (err, data) => {
                if (data?.Afk) {
                    const date = new Date(data.Time);
                    const shortDate = time(date, 'f');
                    const relative = time(date, 'R');
                    return message.reply(`${user1} is currently AFK:**${reason}**. AFK since ` + shortDate + relative);
                }
                return;
            })
        })
    }
})


// antinuke events --------------------------------------------------------------------------------------------------------------------------


client.on("channelDelete", async (channel, err) => {
    const auditLogs = await channel.guild.fetchAuditLogs({ limit: 2, type: AuditLogEvent.ChannelDelete })
    const logs = auditLogs.entries.first();
    const { executor, target } = logs;
    const executorId = executor.id;
    console.log(executorId);
    const owner = channel.guild.fetchOwner()
    const ownerID = owner.id

    if (executor.id === channel.guild.ownerID) return;
    if (executor.id === client.user.id) return;
    anModel.findOne({ GuildID: channel.guild.id }, async (err, data) => {
                if (!data) return;
        if (data.Active == false) return;
        try {
            if (!data) {
                return;
            }
        } catch (err) {
            console.log(err);
        }
    });
    wlModel.findOne({ GuildID: channel.guild.id, UserID: executorId, Whitelisted: true }, async (err, data2) => {
        try {
            if (data2) {
                return;
            } else {
                try {
                    channel.guild.members.ban(executorId, {
                        reason: "Antinuke: Channel Delete"
                    }).then(() => {
                        console.log('banned nuker')
                    }).catch(err => {
                        console.log(err);
                    });
                } catch (error) {
                    console.log(error);
                }
            }
        } catch (e) {
            console.log('not able to ban nuker');
        }
    })
});


client.on("roleDelete", async (channel) => {
    const auditLogs = await channel.guild.fetchAuditLogs({ limit: 3, type: AuditLogEvent.RoleDelete })
    const logs = auditLogs.entries.first();
    const { executor, target } = logs;
    const executorId = executor.id;
    console.log(executorId);
    const owner = channel.guild.fetchOwner()
    const ownerID = owner.id

    if (executor.id === channel.guild.ownerID) return;
    if (executor.id === client.user.id) return;
    anModel.findOne({ GuildID: channel.guild.id }, async (err, data) => {
        if (!data) return;
        if (data.Active === false) return;
        try {
            if (!data) {
                return;
            }
        } catch (err) {
            console.log(err);
        }
    });
    wlModel.findOne({ GuildID: channel.guild.id, UserID: executorId, Whitelisted: true }, async (err, data2) => {
        try {
            if (data2) {
                return;
            } else {
                try {
                    channel.guild.members.ban(executorId, {
                        reason: "Antinuke: Role Delete"
                    }).then(() => {
                        console.log('banned nuker')
                    }).catch(err => {
                        console.log(err);
                    });
                } catch (error) {
                    console.log(error);
                }
            }
        } catch (e) {
            console.log('not able to ban nuker');
        }
    })
});


client.on('channelCreate', async (channel) => {
    const auditLogs = await channel.guild.fetchAuditLogs({ limit: 5, type: AuditLogEvent.ChannelCreate })
    const logs = auditLogs.entries.first();
    const { executor, target } = logs;
    const executorId = executor.id;
    console.log(executorId);
    const owner = channel.guild.fetchOwner()
    const ownerID = owner.id

    if (executor.id === channel.guild.ownerID) return;
    if (executor.id === client.user.id) return;
    anModel.findOne({ GuildID: channel.guild.id }, async (err, data) => {
                if (!data) return;
        if (data.Active == false) return;
        try {
            if (!data) {
                return;
            }
        } catch (err) {
            console.log(err);
        }
    });
    wlModel.findOne({ GuildID: channel.guild.id, UserID: executorId, Whitelisted: true }, async (err, data2) => {
        try {
            if (data2) {
                console.log(data2);
                return;
            } else {
                try {
                    channel.guild.members.ban(executorId, {
                        reason: "Antinuke: Channel Create"
                    }).then(() => {
                        console.log('banned nuker')
                    }).catch(err => {
                        console.log(err);
                    });
                } catch (error) {
                    console.log(error);
                }
            }
        } catch (e) {
            console.log('not able to ban nuker');
        }
    })
});


client.on('guildBanAdd', async (channel) => {
    const auditLogs = await channel.guild.fetchAuditLogs({ limit: 5, type: AuditLogEvent.MemberBanAdd })
    const logs = auditLogs.entries.first();
    const { executor, target } = logs;
    const executorId = executor.id;
    console.log(executorId);
    const owner = channel.guild.fetchOwner()
    const ownerID = owner.id

    if (executor.id === channel.guild.ownerID) return;
    if (executor.id === client.user.id) return;
    anModel.findOne({ GuildID: channel.guild.id }, async (err, data) => {
                if (!data) return;
        if (data.Active == false) return;
        try {
            if (!data) {
                return;
            }
        } catch (err) {
            console.log(err);
        }
    });
    wlModel.findOne({ GuildID: channel.guild.id, UserID: executorId, Whitelisted: true }, async (err, data2) => {
        try {
            if (data2) {
                console.log(data2);
                return;
            } else {
                try {
                    channel.guild.members.ban(executorId, {
                        reason: "Antinuke: Ban Spam"
                    }).then(() => {
                        console.log('banned nuker')
                    }).catch(err => {
                        console.log(err);
                    });
                } catch (error) {
                    console.log(error);
                }
            }
        } catch (e) {
            console.log('not able to ban nuker');
        }
    })
});


client.on(Events.WebhooksUpdate, async (channel) => {
    const auditLogs = await channel.guild.fetchAuditLogs({ limit: 5, type: AuditLogEvent.WebhookCreate })
    const logs = auditLogs.entries.first();
    const { executor, target } = logs;
    const executorId = executor.id;
    console.log(executorId);
    const owner = channel.guild.fetchOwner()
    const ownerID = owner.id

    if (executor.id === channel.guild.ownerID) return;
    if (executor.id === client.user.id) return;
    anModel.findOne({ GuildID: channel.guild.id }, async (err, data) => {
                if (!data) return;
        if (data.Active == false) return;
        try {
            if (!data) {
                return;
            }
        } catch (err) {
            console.log(err);
        }
    });
    wlModel.findOne({ GuildID: channel.guild.id, UserID: executorId, Whitelisted: true }, async (err, data2) => {
        try {
            if (data2) {
                console.log(data2);
                return;
            } else {
                try {
                    channel.guild.members.ban(executorId, {
                        reason: "Antinuke: Webhook Spam"
                    }).then(() => {
                        console.log('banned nuker')
                    }).catch(err => {
                        console.log(err);
                    });
                } catch (error) {
                    console.log(error);
                }
            }
        } catch (e) {
            console.log('not able to ban nuker');
        }
    })
});