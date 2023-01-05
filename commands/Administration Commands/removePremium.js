const User = require("../../schema/user");
const { CommandInteraction, MessageEmbed } = require("discord.js");
module.exports = {
  name: "removepremium",
  description: "removes premium from a user",
  usage: "/removepremium [user]",
  options: [
    {
      name: "user",
      description: `mention a premium user`,
      type: "USER",
      required: true,
    },
  ],
  /**
   * @param {CommandInteraction} interaction
   */
  async execute(interaction, client) {
    // Code
    if (interaction.user.id !== "223504240935436288")
      if (interaction.user.id !== "909207676666392596")
        if (interaction.user.id !== "527574678865182731")
          if (interaction.user.id !== "236958675795705857")
            if (interaction.user.id !== "925009350605549590")
              if (interaction.user.id !== "294837168256450562")
                if (interaction.user.id !== "317980784810131457")
                    return interaction.reply(
                      `You are not allowed to remove premium from users`
                    );

    let user = interaction.options.getUser("user");
    let data = client.userSettings.get(user.id);
    if (!data.isPremium) {
      return interaction.reply(`${user} is Not a Premium User`);
    } else {
      await User.findOneAndRemove({ Id: user.id });
      await client.userSettings.delete(user.id);
      interaction.reply(`${user} Removed From Premium`);
    }
  },
};
