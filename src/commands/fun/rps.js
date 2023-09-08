const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rps')
        .setDescription('Play a rock-paper-scissor with the bot'),
    async execute(interaction, client) {
        const {
            member,
        } = interaction;

        const Button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Rock")
                    .setStyle("Primary")
                    .setCustomId("isRock-Rps"),

                new ButtonBuilder()
                    .setLabel("Paper")
                    .setStyle("Primary")
                    .setCustomId("isPaper-Rps"),

                new ButtonBuilder()
                    .setLabel("Scissor")
                    .setStyle("Primary")
                    .setCustomId("isScissor-Rps"),
            );

        interaction.deferUpdate;
        const sent = await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('RockPaperScissor')
                    .setDescription("Let's Play an RPS!\nUse button below to choose!")
                    .setTimestamp()
                    .setColor(0x8fcb8d)
            ],
            components: [Button]
        });

        let Draw = 0;
        let Wins = 0;
        let Lose = 0;

        let collector = sent.createMessageComponentCollector({
            time: 1000 * 60,
        });

        collector.on("collect",
            async interaction => {
                if (!interaction.customId.includes("-Rps")) return;
                if (interaction.user.id !== member.id) return interaction.reply({
                    content: "You are not the user that run the commands!",
                    ephemeral: true
                });

                const choice = ["Rock",
                    "Paper",
                    "Scissor"];

                const botChoice = choice[Math.floor(Math.random() * choice.length)];

                if (interaction.customId == "isRock-Rps") {
                    if (botChoice == "Rock") {

                        Draw++

                        interaction.deferUpdate;
                        const sent = await interaction.update({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle('Rock Paper Scissors')
                                    .setDescription(`\n**My Choices**\n:fist: Rock\n\n**Vs**\n\n**Your Choices**\n:fist: Rock\n\n**Result: Draw**`)
                                    .setTimestamp()
                                    .setColor(0x8fcb8d)
                            ],
                            components: [new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel("Rock")
                                        .setStyle("Primary")
                                        .setCustomId("isRock")
                                        .setDisabled(),

                                    new ButtonBuilder()
                                        .setLabel("Paper")
                                        .setStyle("Secondary")
                                        .setCustomId("isPaper")
                                        .setDisabled(),

                                    new ButtonBuilder()
                                        .setLabel("Scissor")
                                        .setStyle("Secondary")
                                        .setCustomId("isScissor")
                                        .setDisabled(),
                                ),
                            new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel("Rematch?")
                                        .setStyle("Success")
                                        .setCustomId("isRematch-Rps"),
                                    new ButtonBuilder()
                                        .setLabel("Close")
                                        .setStyle("Danger")
                                        .setCustomId("isClose-Rps")
                                )
                            ]
                        });

                    } else if (botChoice == "Paper") {


                        Lose++

                        interaction.deferUpdate;
                        const sent = await interaction.update({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle('Rock Paper Scissors')
                                    .setDescription(`\n**My Choices**\n:raised_hand: Paper\n\n**Vs**\n\n**Your Choices**\n:fist: Rock\n\n**Result: Sorry. You lose**`)
                                    .setTimestamp()
                                    .setColor(0x8fcb8d)

                            ],
                            components: [new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel("Rock")
                                        .setStyle("Danger")
                                        .setCustomId("isRock")
                                        .setDisabled(),

                                    new ButtonBuilder()
                                        .setLabel("Paper")
                                        .setStyle("Success")
                                        .setCustomId("isPaper")
                                        .setDisabled(),

                                    new ButtonBuilder()
                                        .setLabel("Scissor")
                                        .setStyle("Secondary")
                                        .setCustomId("isScissor")
                                        .setDisabled(),
                                ),
                            new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel("Rematch?")
                                        .setStyle("Success")
                                        .setCustomId("isRematch-Rps"),
                                    new ButtonBuilder()
                                        .setLabel("Close")
                                        .setStyle("Danger")
                                        .setCustomId("isClose-Rps")
                                )
                            ]
                        });

                    } else if (botChoice == "Scissor") {


                        Wins++

                        interaction.deferUpdate;
                        const sent = await interaction.update({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle('Rock Paper Scissors')
                                    .setDescription(`\n**My Choices**\n:v: Scissor\n\n**Vs**\n\n**Your Choices**\n:fist: Rock\n\n**Result: Congrats. You Wins!**`)
                                    .setTimestamp()
                                    .setColor(0x8fcb8d)

                            ],
                            components: [new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel("Rock")
                                        .setStyle("Success")
                                        .setCustomId("isRock")
                                        .setDisabled(),

                                    new ButtonBuilder()
                                        .setLabel("Paper")
                                        .setStyle("Secondary")
                                        .setCustomId("isPaper")
                                        .setDisabled(),

                                    new ButtonBuilder()
                                        .setLabel("Scissor")
                                        .setStyle("Secondary")
                                        .setCustomId("isScissor")
                                        .setDisabled(),
                                ),
                            new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel("Rematch?")
                                        .setStyle("Success")
                                        .setCustomId("isRematch-Rps"),
                                    new ButtonBuilder()
                                        .setLabel("Close")
                                        .setStyle("Danger")
                                        .setCustomId("isClose-Rps")
                                )
                            ]
                        });

                    };

                } else if (interaction.customId == "isPaper-Rps") {
                    if (botChoice == "Rock") {


                        Wins++

                        interaction.deferUpdate;
                        const sent = await interaction.update({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle('Rock Paper Scissors')
                                    .setDescription(`\n**My Choices**\n:fist: Rock\n\n**Vs**\n\n**Your Choices**\n:raised_hand: Paper\n\n**Result: Congrats. You Wins!**`)
                                    .setTimestamp()
                                    .setColor(0x8fcb8d)

                            ],
                            components: [new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel("Rock")
                                        .setStyle("Secondary")
                                        .setCustomId("isRock")
                                        .setDisabled(),

                                    new ButtonBuilder()
                                        .setLabel("Paper")
                                        .setStyle("Success")
                                        .setCustomId("isPaper")
                                        .setDisabled(),

                                    new ButtonBuilder()
                                        .setLabel("Scissor")
                                        .setStyle("Secondary")
                                        .setCustomId("isScissor")
                                        .setDisabled(),
                                ),
                            new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel("Rematch?")
                                        .setStyle("Success")
                                        .setCustomId("isRematch-Rps"),
                                    new ButtonBuilder()
                                        .setLabel("Close")
                                        .setStyle("Danger")
                                        .setCustomId("isClose-Rps")
                                )
                            ]
                        });

                    } else if (botChoice == "Paper") {


                        Draw++

                        interaction.deferUpdate;
                        const sent = await interaction.update({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle('Rock Paper Scissors')
                                    .setDescription(`\n**My Choices**\n:raised_hand: Paper\n\n**Vs**\n\n**Your Choices**\n:raised_hand: Paper\n\n**Result: Draw**`)
                                    .setTimestamp()
                                    .setColor(0x8fcb8d)

                            ],
                            components: [new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel("Rock")
                                        .setStyle("Secondary")
                                        .setCustomId("isRock")
                                        .setDisabled(),

                                    new ButtonBuilder()
                                        .setLabel("Paper")
                                        .setStyle("Primary")
                                        .setCustomId("isPaper")
                                        .setDisabled(),

                                    new ButtonBuilder()
                                        .setLabel("Scissor")
                                        .setStyle("Secondary")
                                        .setCustomId("isScissor")
                                        .setDisabled(),
                                ),
                            new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel("Rematch?")
                                        .setStyle("Success")
                                        .setCustomId("isRematch-Rps"),
                                    new ButtonBuilder()
                                        .setLabel("Close")
                                        .setStyle("Danger")
                                        .setCustomId("isClose-Rps")
                                )
                            ]
                        });

                    } else if (botChoice == "Scissor") {


                        Lose++

                        interaction.deferUpdate;
                        const sent = await interaction.update({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle('Rock Paper Scissors')
                                    .setDescription(`\n**My Choices**\n:v: Scissor\n\n**Vs**\n\n**Your Choices**\n:raised_hand: Paper\n\n**Result: Sorry. You lose**`)
                                    .setTimestamp()
                                    .setColor(0x8fcb8d)

                            ],
                            components: [new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel("Rock")
                                        .setStyle("Secondary")
                                        .setCustomId("isRock")
                                        .setDisabled(),

                                    new ButtonBuilder()
                                        .setLabel("Paper")
                                        .setStyle("Danger")
                                        .setCustomId("isPaper")
                                        .setDisabled(),

                                    new ButtonBuilder()
                                        .setLabel("Scissor")
                                        .setStyle("Success")
                                        .setCustomId("isScissor")
                                        .setDisabled(),
                                ),
                            new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel("Rematch?")
                                        .setStyle("Success")
                                        .setCustomId("isRematch-Rps"),
                                    new ButtonBuilder()
                                        .setLabel("Close")
                                        .setStyle("Danger")
                                        .setCustomId("isClose-Rps")
                                )
                            ]
                        });

                    };

                } else if (interaction.customId == "isScissor-Rps") {
                    if (botChoice == "Rock") {


                        Lose++

                        interaction.deferUpdate;
                        const sent = await interaction.update({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle('Rock Paper Scissors')
                                    .setDescription(`\n**My Choices**\n:fist: Rock\n\n**Vs**\n\n**Your Choices**\n:v: Scissor\n\n**Result: Sorry. You lose**`)
                                    .setTimestamp()
                                    .setColor(0x8fcb8d)

                            ],
                            components: [new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel("Rock")
                                        .setStyle("Success")
                                        .setCustomId("isRock")
                                        .setDisabled(),

                                    new ButtonBuilder()
                                        .setLabel("Paper")
                                        .setStyle("Secondary")
                                        .setCustomId("isPaper")
                                        .setDisabled(),

                                    new ButtonBuilder()
                                        .setLabel("Scissor")
                                        .setStyle("Danger")
                                        .setCustomId("isScissor")
                                        .setDisabled(),
                                ),
                            new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel("Rematch?")
                                        .setStyle("Success")
                                        .setCustomId("isRematch-Rps"),
                                    new ButtonBuilder()
                                        .setLabel("Close")
                                        .setStyle("Danger")
                                        .setCustomId("isClose-Rps")
                                )
                            ]
                        });

                    } else if (botChoice == "Paper") {


                        Wins++

                        interaction.deferUpdate;
                        const sent = await interaction.update({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle('Rock Paper Scissors')
                                    .setDescription(`\n**My Choices**\n:raised_hand: Paper\n\n**Vs**\n\n**Your Choices**\n:v: Scissor\n\n**Result: Congrats. You Wins!**`)
                                    .setTimestamp()
                                    .setColor(0x8fcb8d)

                            ],
                            components: [new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel("Rock")
                                        .setStyle("Secondary")
                                        .setCustomId("isRock")
                                        .setDisabled(),

                                    new ButtonBuilder()
                                        .setLabel("Paper")
                                        .setStyle("Secondary")
                                        .setCustomId("isPaper")
                                        .setDisabled(),

                                    new ButtonBuilder()
                                        .setLabel("Scissor")
                                        .setStyle("Success")
                                        .setCustomId("isScissor")
                                        .setDisabled(),
                                ),
                            new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel("Rematch?")
                                        .setStyle("Success")
                                        .setCustomId("isRematch-Rps"),
                                    new ButtonBuilder()
                                        .setLabel("Close")
                                        .setStyle("Danger")
                                        .setCustomId("isClose-Rps")
                                )
                            ]
                        });

                    } else if (botChoice == "Scissor") {


                        Draw++

                        interaction.deferUpdate;
                        const sent = await interaction.update({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle('Rock Paper Scissors')
                                    .setDescription(`\n**My Choices**\n:v: Scissor\n\n**Vs**\n\n**Your Choices**\n:v: Scissor\n\n**Result: Draw**`)
                                    .setTimestamp()
                                    .setColor(0x8fcb8d)

                            ],
                            components: [new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel("Rock")
                                        .setStyle("Secondary")
                                        .setCustomId("isRock")
                                        .setDisabled(),

                                    new ButtonBuilder()
                                        .setLabel("Paper")
                                        .setStyle("Secondary")
                                        .setCustomId("isPaper")
                                        .setDisabled(),

                                    new ButtonBuilder()
                                        .setLabel("Scissor")
                                        .setStyle("Primary")
                                        .setCustomId("isScissor")
                                        .setDisabled(),
                                ),
                            new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel("Rematch?")
                                        .setStyle("Success")
                                        .setCustomId("isRematch-Rps"),
                                    new ButtonBuilder()
                                        .setLabel("Close")
                                        .setStyle("Danger")
                                        .setCustomId("isClose-Rps")
                                )
                            ]
                        });

                    };
                };

                if (interaction.customId == "isRematch-Rps" && interaction.user.id == member.id) {

                    const choice = ["Rock",
                        "Paper",
                        "Scissor"];

                    const botChoice = choice[Math.floor(Math.random() * choice.length)];

                    await interaction.deferUpdate;
                    const sent = await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('Rock Paper Scissors')
                                .setDescription(`Let's Rematch!!!\nUse button below to choose!\n\n**Current Stats**\nWins: ${Wins}\nDraw: ${Draw}\nLose: ${Lose}`)
                                .setTimestamp()
                                .setColor(0x8fcb8d)
                        ],
                        components: [Button]
                    });

                };

                if (interaction.customId == "isClose-Rps" && interaction.user.id == member.id) {

                    interaction.deferUpdate;
                    interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('Rock Paper Scissors')
                                .setDescription(`Thank you for playing. i hope we can play together again next time!\n\n**Final Result**\nWins: ${Wins}\nDraw: ${Draw}\nLose: ${Lose}`)
                                .setFooter({
                                    text: "This message will auto delete in 1 minute"
                                })
                                .setColor(0x8fcb8d)
                        ],
                        components: []
                    });

                    setTimeout(() => interaction.message.delete(), 1000 * 60);

                }

            });

        setTimeout(() => {
            if (interaction.message) interaction.message.delete()
        },
            1000 * 60 * 10);

    }
}