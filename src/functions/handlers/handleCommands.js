const fs = require("fs");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

module.exports = client => {
    client.handleCommands = async () => {
      const commandsFolders = fs.readdirSync(`./src/commands`);
      for (const folder of commandsFolders) {
        const commandFiles = fs
          .readdirSync(`./src/commands/${folder}`)
          .filter((file) => file.endsWith(".js"));

        const { commands, commandArray } = client;
        for (const file of commandFiles) {
          const command = require(`../../commands/${folder}/${file}`);
          commands.set(command.data.name, command);
          commandArray.push(command.data.toJSON());
        }
      }
      const clientId = '1051262817786937476';
      const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
      try {
        console.log('Started refreshing application commands...');

        await rest.put(Routes.applicationCommands(clientId), {
          body: client.commandArray,
        });

        console.log('Successfully refreshed application commands.');
      } catch (error) {
        console.error(error);
      }
    };
};