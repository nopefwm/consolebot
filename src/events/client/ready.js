const { mongoose } = require("mongoose");
require('dotenv').config();

module.exports = {
    name: 'ready',
    once: true,
    async execute(interaction, client) {
        await mongoose.connect(process.env.MONGO || '', {
            keepAlive: true,
        })

        if (mongoose.connect) {
            console.log('Connected to Mongoose Database successfully.');
        }
        const activities = [
            'with you?',
            'Interstellar',
            'in discord.gg/nopefwm'
        ]
        setInterval(() => {
            const status = activities[Math.floor(Math.random() * activities.length)];
            client.user.setPresence({ activities: [{ name: `${status}` }] });
        }, 5000);
        console.log(`${client.user.username} is online!`);
    }
}