const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'help',
    description: "Lists of all the bot's commands",
    permission: "SEND_MESSAGES",
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const directorys = fs.readdirSync('commands');
        const command = directorys.map(dir => {
            const files = fs.readdirSync(`./commands/${dir}`);
            const commands = files.map(file => {
                const command = require(`../../commands/${dir}/${file}`);
                return `${command.name} - ${command.description}`;
            }).join('\n');
            return `${dir}:\n${commands}`;
        }).join('\n\n');
        const embed = new MessageEmbed()
            .setTitle('Commands')
            .setDescription(command)
            .setColor('#0099ff');
        return interaction.reply({ embeds: [embed], ephemeral: true});
    }
}