const ms = require('ms-prettify').default;
const timers = require('../../schema/timer');
const createID = require('../../utils/randomId');
const startTimer = require('../../utils/startTimer');

module.exports = {
        name: "remind",
        description: "Set a reminder",
        options: [{
            name: "time",
            description: "Time for this timer, like 10 min 23 sec",
            required: true,
            type: 3,
        }, {
            name: "reason",
            description: "Reason for this reminder",
            required: false,
            type: 3,
        }],

     async execute(interaction, client) {
        const time = ms(interaction.options.getString("time")),
            reason = interaction.options.getString("reason") || "";

        if (!time) return interaction.reply("Invalid time was provided");

        const timer = await timers.create({ id: createID(), user: interaction.user.id, guild: interaction.guild.id, channel: interaction.channel.id, reason, createdAt: Date.now(), time, endAt: Date.now() + time });

        interaction.reply({ content: "Timer started!", ephemeral: true });

        startTimer(client, timer)
    }
}