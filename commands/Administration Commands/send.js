const Discord = require('discord.js')

module.exports = {
    name: 'send',
    category: 'Configuration',
    description: 'Send a message as the bot',
    permissions: ['ADMINISTRATOR'],
    options: [{
        name: "message",
        description: "Message to send as the bot",
        type: "STRING",
        required: true
    }, 
],

    execute(interaction) {
        interaction.channel.send(interaction.options.getString('message').replaceAll('\\n', '\n'));
        interaction.reply({ content: 'Message sent!', ephemeral: true });
    }
}