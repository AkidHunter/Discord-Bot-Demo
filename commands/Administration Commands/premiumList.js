const { CommandInteraction, MessageEmbed, Client } = require("discord.js");
const moment = require("moment");

module.exports = {
  name: "premiumlist",
  description: "Shows a list of all premium users",
  usage: "/premiumlist [target]",
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
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
                    // Change to uyour discord user id
                    return (interaction.reply
                      `You are not able to view the list of premium users`
                    );

    let data = client.userSettings
      .filter((data) => data.isPremium === true)
      .map((data, index) => {
        return ` <@${data.Id}> Expire At :- \`${moment(
          data.premium.expiresAt
        ).format("dddd, MMMM Do YYYY")}\` Plan :- \`${data.premium.plan}\` `;
      });
    interaction.reply({
      embeds: [
        new MessageEmbed().setDescription(
          data.join("\n") || "No Premium User Found"
        ),
      ],
      ephemeral: true,
    });
  },
};
