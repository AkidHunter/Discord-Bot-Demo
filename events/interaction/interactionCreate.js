const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (interaction.isCommand() || interaction.isContextMenu()) {
      const command = client.commands.get(interaction.commandName);
      if (!command)
        return (
          interaction.reply({
            embeds: [
              new MessageEmbed()
                .setColor("RED")
                .setDescription("An error occured while running this command"),
            ],
          }) && client.commands.delete(interaction.commandName)
        );

      if (
        command.permission &&
        !interaction.member.permissions.has(command.permission)
      ) {
        return interaction.reply({
          content: `You do not have the required permission for this command: \`${interaction.commandName}\`.`,
          ephemeral: true,
        });
      }
    } else if (interaction.isSelectMenu()) {
      const { customId, values, member } = interaction;
      if (customId === "auto_roles") {
        const component = interaction.component;
        const removed = component.options.filter((option) => {
          return !values.includes(option.value);
        });

        for (const id of removed) {
          member.roles.remove(id.value);
        }

        for (const id of values) {
          member.roles.add(id);
        }
      }
      interaction.reply({
        ephemeral: true,
        content: "Roles updated!",
      });
    }
    // PREMIUM CODE START

    const command = client.commands.get(interaction.commandName);

    const User = require("../../schema/user");
    if (command) {
      let user = client.userSettings.get(interaction.user.id);
      // If there is no user, create it in the Database as "newUser"
      if (!user) {
        const findUser = await User.findOne({ Id: interaction.user.id });
        if (!findUser) {
          const newUser = await User.create({ Id: interaction.user.id });
          client.userSettings.set(interaction.user.id, newUser);
          user = newUser;
        } else return;
      }

      if (command.premium && user && !user.isPremium) {
        return interaction.reply(`You are not premium user`);
      } else {
        return await command.execute(interaction, client);
      }
    }
  },
};
